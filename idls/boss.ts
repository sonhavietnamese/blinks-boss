export type Boss = {
  version: '0.1.0'
  name: 'boss'
  instructions: [
    {
      name: 'createBoss'
      accounts: [
        {
          name: 'boss'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'bossId'
          type: 'u64'
        },
        {
          name: 'health'
          type: 'u64'
        },
      ]
    },
    {
      name: 'dealDamage'
      accounts: [
        {
          name: 'boss'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: true
          isSigner: true
        },
        {
          name: 'record'
          isMut: true
          isSigner: false
        },
        {
          name: 'systemProgram'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'damage'
          type: 'u64'
        },
        {
          name: 'timestamp'
          type: 'i64'
        },
      ]
    },
    {
      name: 'withdraw'
      accounts: [
        {
          name: 'boss'
          isMut: true
          isSigner: false
        },
        {
          name: 'user'
          isMut: false
          isSigner: true
        },
        {
          name: 'recipient'
          isMut: false
          isSigner: false
        },
      ]
      args: [
        {
          name: 'amount'
          type: 'u64'
        },
      ]
    },
  ]
  accounts: [
    {
      name: 'boss'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'bossId'
            type: 'u64'
          },
          {
            name: 'health'
            type: 'u64'
          },
          {
            name: 'maxHealth'
            type: 'u64'
          },
          {
            name: 'bump'
            type: 'u8'
          },
          {
            name: 'owner'
            type: 'publicKey'
          },
        ]
      }
    },
    {
      name: 'record'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'boss'
            type: 'publicKey'
          },
          {
            name: 'address'
            type: 'publicKey'
          },
          {
            name: 'damage'
            type: 'u64'
          },
          {
            name: 'timestamp'
            type: 'i64'
          },
        ]
      }
    },
  ]
  errors: [
    {
      code: 6000
      name: 'BossAlreadyDefeated'
      msg: '[001] Boss is already defeated'
    },
    {
      code: 6001
      name: 'InsufficientFunds'
      msg: '[002] Insufficient funds'
    },
    {
      code: 6002
      name: 'NotTheOwner'
      msg: '[003] Not the owner'
    },
  ]
}

export const IDL: Boss = {
  version: '0.1.0',
  name: 'boss',
  instructions: [
    {
      name: 'createBoss',
      accounts: [
        {
          name: 'boss',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'bossId',
          type: 'u64',
        },
        {
          name: 'health',
          type: 'u64',
        },
      ],
    },
    {
      name: 'dealDamage',
      accounts: [
        {
          name: 'boss',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'record',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'damage',
          type: 'u64',
        },
        {
          name: 'timestamp',
          type: 'i64',
        },
      ],
    },
    {
      name: 'withdraw',
      accounts: [
        {
          name: 'boss',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'user',
          isMut: false,
          isSigner: true,
        },
        {
          name: 'recipient',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'amount',
          type: 'u64',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'boss',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'bossId',
            type: 'u64',
          },
          {
            name: 'health',
            type: 'u64',
          },
          {
            name: 'maxHealth',
            type: 'u64',
          },
          {
            name: 'bump',
            type: 'u8',
          },
          {
            name: 'owner',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'record',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'boss',
            type: 'publicKey',
          },
          {
            name: 'address',
            type: 'publicKey',
          },
          {
            name: 'damage',
            type: 'u64',
          },
          {
            name: 'timestamp',
            type: 'i64',
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'BossAlreadyDefeated',
      msg: '[001] Boss is already defeated',
    },
    {
      code: 6001,
      name: 'InsufficientFunds',
      msg: '[002] Insufficient funds',
    },
    {
      code: 6002,
      name: 'NotTheOwner',
      msg: '[003] Not the owner',
    },
  ],
}
