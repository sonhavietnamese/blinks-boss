use anchor_lang::prelude::*;
use anchor_lang::system_program::{transfer, Transfer};

declare_id!("26YEmGf4WrnuLduZzdReSGFM2pPVkLCW4YnL8vXyrm7R");

pub const DISCRIMINATOR_SIZE: usize = 8;

#[error_code]
pub enum BossError {
    #[msg("[001] Boss is already defeated")]
    BossAlreadyDefeated,
    #[msg("[002] Insufficient funds")]
    InsufficientFunds,
    #[msg("[003] Not the owner")]
    NotTheOwner,
}

#[program]
mod boss {
    use super::*;

    pub fn create_boss(ctx: Context<CreateBoss>, boss_id: u64, health: u64) -> Result<()> {
        let boss = &mut ctx.accounts.boss;
        boss.boss_id = boss_id;
        boss.health = health;
        boss.max_health = health;
        boss.bump = ctx.bumps.boss;
        boss.owner = *ctx.accounts.user.key;
        Ok(())
    }

    pub fn deal_damage(ctx: Context<DealDamage>, damage: u64, timestamp: i64) -> Result<()> {
        let boss = &mut ctx.accounts.boss;
        let record = &mut ctx.accounts.record;

        if boss.health == 0 {
            return Err(BossError::BossAlreadyDefeated.into());
        }

        let transfer_amount = damage * 10_000;

        if ctx.accounts.user.lamports() < transfer_amount as u64 {
            return Err(BossError::InsufficientFunds.into());
        }

        let cpi_accounts = Transfer {
            from: ctx.accounts.user.to_account_info(),
            to: boss.to_account_info(),
        };
        let cpi_program = ctx.accounts.system_program.to_account_info();
        let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
        transfer(cpi_context, transfer_amount)?;

        if damage >= boss.health {
            boss.health = 0;
        } else {
            boss.health -= damage;
        }

        let player_address = *ctx.accounts.user.key;

        record.boss = ctx.accounts.boss.key();
        record.address = player_address;
        record.damage += damage;
        record.timestamp = timestamp;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let boss = &mut ctx.accounts.boss;

        if boss.owner != *ctx.accounts.user.key {
            return Err(BossError::NotTheOwner.into());
        }

        let boss_account_info = ctx.accounts.boss.to_account_info();
        let recipient_account_info = ctx.accounts.recipient.to_account_info();

        **boss_account_info.try_borrow_mut_lamports()? -= amount;
        **recipient_account_info.try_borrow_mut_lamports()? += amount;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(boss_id: u64)]
pub struct CreateBoss<'info> {
    #[account(
        init,
        payer = user,
        space = DISCRIMINATOR_SIZE + Boss::INIT_SPACE, 
        seeds = [b"boss", user.key().as_ref(), boss_id.to_le_bytes().as_ref()],
        bump
    )]
    pub boss: Account<'info, Boss>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default, InitSpace)]
pub struct Boss {
    pub boss_id: u64,
    pub health: u64,
    pub max_health: u64,
    pub bump: u8,
    pub owner: Pubkey,
}

#[derive(Accounts)]
pub struct DealDamage<'info> {
    #[account(mut)]
    pub boss: Account<'info, Boss>,
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init_if_needed,
        payer = user,
        space = DISCRIMINATOR_SIZE + Record::INIT_SPACE,
        seeds = [b"record", user.key().as_ref(), boss.key().as_ref()],
        bump
    )]
    pub record: Account<'info, Record>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace, Default)]
pub struct Record {
    pub boss: Pubkey,
    pub address: Pubkey,
    pub damage: u64,
    pub timestamp: i64,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub boss: Account<'info, Boss>,
    pub user: Signer<'info>,
    /// CHECK: This is a checked account, we only need the public key
    pub recipient: UncheckedAccount<'info>,
}
