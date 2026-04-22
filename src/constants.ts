import { Game, EPal, Post } from './types';

export const GAMES: Game[] = [
  {
    id: 'lol',
    name: 'League Pro',
    onlineCount: '1.2k Online',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasMain: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'val',
    name: 'Tactical Duo',
    onlineCount: '850 Online',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasMain: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'pubg',
    name: 'Battle Royale',
    onlineCount: '2.1k Online',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'genshin',
    name: 'Open World',
    onlineCount: '3.4k Online',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    onlineCount: '1.5k Online',
    imageUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasMain: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'dota',
    name: 'Dota 2',
    onlineCount: '900 Online',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasMain: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'csgo',
    name: 'CS:GO',
    onlineCount: '4.2k Online',
    imageUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop',
    category: 'GAMES',
    hasRank: true,
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    onlineCount: '10k Online',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop',
    category: 'CHILLING',
    hasServer: true,
    hasPlatform: true
  },
  {
    id: 'chat',
    name: 'Just Chatting',
    onlineCount: '5k Online',
    imageUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop',
    category: 'CHILLING'
  }
];

export const POSTS: Post[] = [
  {
    id: 'p1',
    userId: '1',
    userName: 'Lumina_Sky',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    content: 'Just reached Challenger rank! Who wants to celebrate with a few games? 🎮✨',
    images: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'],
    gameId: 'lol',
    gameName: 'League Pro',
    likes: 124,
    comments: 2,
    commentsList: [
      {
        id: 'c1',
        userId: '2',
        userName: 'ShadowReap',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
        content: 'Congrats! Let\'s play tomorrow.',
        likes: 5,
        timestamp: Date.now() - 1800000
      },
      {
        id: 'c2',
        userId: '3',
        userName: 'Aria_Flow',
        userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
        content: 'Insane! Teach me your ways.',
        likes: 2,
        timestamp: Date.now() - 900000
      }
    ],
    timestamp: Date.now() - 3600000,
    isLiked: true
  },
  {
    id: 'p2',
    userId: '3',
    userName: 'Aria_Flow',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    content: 'Looking for a duo for Valorant tonight. Let\'s climb together! 🔫🔥',
    gameId: 'val',
    gameName: 'Tactical Duo',
    likes: 85,
    comments: 0,
    timestamp: Date.now() - 7200000
  },
  {
    id: 'p3',
    userId: '2',
    userName: 'ShadowReap',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    content: 'New sniper montage is out! Check out these headshots. 🎯💥',
    images: ['https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1957&auto=format&fit=crop'],
    gameId: 'pubg',
    gameName: 'Battle Royale',
    likes: 210,
    comments: 1,
    commentsList: [
      {
        id: 'c3',
        userId: '1',
        userName: 'Lumina_Sky',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
        content: 'That last shot was incredible!',
        likes: 12,
        timestamp: Date.now() - 3600000
      }
    ],
    timestamp: Date.now() - 86400000
  }
];

export const EPALS: EPal[] = [
  {
    id: '1',
    name: 'Lumina_Sky',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
    rating: 5.0,
    orderCount: '2.4k',
    price: 15,
    game: 'League of Legends',
    tags: ['VOICE CHAT', 'PRO', 'LOL', 'CARRY', 'COACH'],
    gender: 'Female',
    onlineStatus: 'Online',
    region: 'North America',
    followersCount: '12.4k',
    followingCount: '156',
    isLegend: true,
    playlinks: [
      {
        id: 'pl1',
        gameName: 'League of Legends',
        nickname: 'LuminaSky#NA1',
        rank: 'Challenger',
        server: 'North America',
        role: 'Support',
        platform: 'PC',
        style: 'Aggressive',
        posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
      },
      {
        id: 'pl2',
        gameName: 'Valorant',
        nickname: 'Lumina#Radiant',
        rank: 'Radiant',
        server: 'NA West',
        role: 'Duelist',
        platform: 'PC',
        style: 'Carry',
        posterUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop'
      },
      {
        id: 'pl3',
        gameName: 'Apex Legends',
        nickname: 'SkyRunner',
        rank: 'Predator',
        server: 'Oregon',
        role: 'Wraith Main',
        platform: 'PC',
        style: 'Tactical',
        posterUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop'
      },
      {
        id: 'pl4',
        gameName: 'Genshin Impact',
        nickname: 'LuminaTraveler',
        rank: 'AR 60',
        server: 'America',
        role: 'All Characters',
        platform: 'Mobile',
        style: 'Chill',
        posterUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop'
      }
    ],
    services: [
      {
        id: 's1',
        name: 'League of Legends',
        icon: 'Gamepad2',
        posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
        description: 'Professional LoL carry and coaching. I can help you climb the ranks or just have a fun time in normals!',
        rating: 5.0,
        orderCount: '1.2k',
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop'
        ],
        variants: [
          { name: 'Normal Game', price: 15, unit: 'Game' },
          { name: 'Ranked Carry', price: 25, unit: 'Game' },
          { name: 'Coaching Session', price: 40, unit: 'Hour' }
        ],
        details: {
          rank: 'Challenger',
          server: 'NA / EUW',
          main: 'Support / Mid',
          style: 'Aggressive / Playmaker',
          platform: 'PC'
        }
      },
      {
        id: 's2',
        name: 'Voice Chat',
        icon: 'Mic2',
        posterUrl: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop',
        description: 'Need someone to talk to? I am a great listener and love chatting about anything from games to life!',
        rating: 4.9,
        orderCount: '800',
        screenshots: [
          'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=1974&auto=format&fit=crop'
        ],
        variants: [
          { name: 'Casual Chat', price: 10, unit: 'Hour' },
          { name: 'Deep Talk', price: 15, unit: 'Hour' }
        ],
        details: {
          style: 'Friendly / Empathetic',
          platform: 'Discord / In-game'
        }
      }
    ],
    reviews: [
      {
        id: 'r1',
        userName: 'GamerPro99',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
        rating: 5,
        comment: 'Amazing carry! We won 5 games in a row. Highly recommended.',
        date: '2 days ago',
        timestamp: 1711453708000,
        tags: ['Pro player', 'Friendly']
      },
      {
        id: 'r2',
        userName: 'ChillVibes',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop',
        rating: 5,
        comment: 'So fun to talk to! Made my evening much better.',
        date: '1 week ago',
        timestamp: 1711021708000,
        tags: ['Good voice', 'Friendly']
      },
      {
        id: 'r3',
        userName: 'NoobMaster',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
        rating: 4,
        comment: 'A bit quiet but very patient with me.',
        date: '3 weeks ago',
        timestamp: 1709812108000,
        tags: ['Patient']
      }
    ],
    reviewTags: [
      { name: 'Good voice', count: 124 },
      { name: 'Pro player', count: 98 },
      { name: 'Friendly', count: 85 },
      { name: 'Patient', count: 42 },
      { name: 'Funny', count: 31 }
    ]
  },
  {
    id: '2',
    name: 'ShadowReap',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9,
    orderCount: '1.8k',
    price: 22,
    game: 'PUBG',
    tags: ['PUBG', 'CARRY', 'SNIPER', 'PRO'],
    isLegend: true,
    gender: 'Male',
    onlineStatus: 'Online',
    playlinks: [
      {
        id: 'pl5',
        gameName: 'PUBG',
        nickname: 'ShadowReap',
        rank: 'Master',
        server: 'Asia',
        platform: 'PC',
        style: 'Sniper',
        posterUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop'
      }
    ]
  },
  {
    id: '3',
    name: 'Aria_Flow',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop',
    rating: 5.0,
    orderCount: '3.1k',
    price: 12,
    game: 'Valorant',
    tags: ['CHILL', 'SUPPORT', 'VALORANT', 'VOICE'],
    isLegend: true,
    gender: 'Female',
    onlineStatus: 'Online',
    playlinks: [
      {
        id: 'pl6',
        gameName: 'Valorant',
        nickname: 'AriaFlow',
        rank: 'Diamond',
        server: 'EU West',
        platform: 'PC',
        style: 'Chill',
        posterUrl: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop'
      }
    ]
  },
  {
    id: '4',
    name: 'Zenith_Gamer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    rating: 4.8,
    orderCount: '900',
    price: 18,
    game: 'Apex Legends',
    tags: ['APEX', 'PRO'],
    isLegend: true,
    gender: 'Male',
    onlineStatus: 'Offline',
    playlinks: [
      {
        id: 'pl7',
        gameName: 'Apex Legends',
        nickname: 'Zenith',
        rank: 'Platinum',
        server: 'Singapore',
        platform: 'PS',
        style: 'Pro',
        posterUrl: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=2070&auto=format&fit=crop'
      }
    ]
  },
  {
    id: '9',
    name: 'Nova_Star',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9,
    orderCount: '1.5k',
    price: 20,
    game: 'Valorant',
    tags: ['PRO', 'VOICE CHAT'],
    isLegend: true
  },
  {
    id: '10',
    name: 'Echo_Vibe',
    avatarUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
    rating: 5.0,
    orderCount: '2.8k',
    price: 18,
    game: 'Genshin Impact',
    tags: ['CHILL', 'GUIDE'],
    isLegend: true
  },
  {
    id: '11',
    name: 'Blaze_Runner',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    rating: 4.8,
    orderCount: '1.1k',
    price: 15,
    game: 'PUBG',
    tags: ['CARRY', 'PRO'],
    isLegend: true
  },
  {
    id: '12',
    name: 'Luna_Moon',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
    rating: 4.7,
    orderCount: '3.2k',
    price: 12,
    game: 'League of Legends',
    tags: ['SUPPORT', 'CHILL'],
    isLegend: true
  },
  {
    id: '13',
    name: 'Storm_Edge',
    avatarUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop',
    rating: 4.9,
    orderCount: '2.1k',
    price: 22,
    game: 'Apex Legends',
    tags: ['PRO', 'CARRY'],
    isLegend: true
  },
  {
    id: '14',
    name: 'Jade_Dragon',
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=2071&auto=format&fit=crop',
    rating: 5.0,
    orderCount: '4.0k',
    price: 25,
    game: 'Dota 2',
    tags: ['PRO', 'STRATEGY'],
    isLegend: true
  },
  {
    id: '5',
    name: 'Frost_Bite',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    rating: 4.7,
    orderCount: '1.2k',
    price: 10,
    game: 'Minecraft',
    tags: ['BUILDER'],
    isLegend: false
  },
  {
    id: '6',
    name: 'Cyber_Punk',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
    rating: 4.9,
    orderCount: '2.2k',
    price: 25,
    game: 'Valorant',
    tags: ['RAD'],
    isLegend: false
  },
  {
    id: '7',
    name: 'Misty_Rose',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974&auto=format&fit=crop',
    rating: 5.0,
    orderCount: '4.5k',
    price: 30,
    game: 'League of Legends',
    tags: ['MID', 'CARRY'],
    isLegend: false
  },
  {
    id: '8',
    name: 'Iron_Will',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    rating: 4.6,
    orderCount: '500',
    price: 8,
    game: 'Dota 2',
    tags: ['TANK'],
    isLegend: false
  }
];
