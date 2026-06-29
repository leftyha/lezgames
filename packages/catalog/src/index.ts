export type GameStatus = 'live' | 'beta' | 'coming_soon';
export type Game = { id:string; title:string; slug:string; status:GameStatus; shortDescription:string; fullDescription:string; category:string; tags:string[]; thumbnail:string; ogImage:string; isPlayable:boolean; gameUrl:string; gameType:'iframe'|'canvas'; supportedDevices:string[]; controls:string[]; rewardRules:{baseCoins:number; dailyCap:number}; adRules:{interstitialEveryDeaths:number; banner:boolean}; storeCompatibility:string[]; releaseDate:string; seoTitle:string; seoDescription:string; faq:{q:string;a:string}[]; relatedGames:string[] };
const rawGames: Array<[string,string,string,string,boolean]> = [
['golden-rain-zombies','Golden Rain Zombies','Survive toxic rain, rescue civilians and outlast weird zombie waves.','zombie',true],
['huevo-no-te-quiebres','Huevo No Te Quiebres','Roll a fragile egg through brutal physics traps without cracking.','egg',true],
['break-me','Break Me','A puzzle arcade game where you win by breaking the UI rules.','puzzle',true],
['cell-front-lite','Cell Front Lite','Capture territory with a vulnerable trail while strange bots hunt you.','io',true],
['egg-catch-me','Egg Catch Me','Catch falling eggs, dodge bad drops and chain impossible combos.','egg',true],
['gravity-dungeon-dash','Gravity Dungeon Dash','Dash through spikes, reverse gravity and retry in seconds.','arcade',true],
['zombie-umbrella-run','Zombie Umbrella Run','Runner survival with toxic umbrellas and hungry streets.','zombie',true],
['weird-death-button','Weird Death Button','Tap the forbidden button, then survive the consequences.','weird',true],
['physics-skull-drop','Physics Skull Drop','Drop skulls through a cruel physics machine for high scores.','physics',true],
['egg-vs-moon','Egg vs Moon','Deflect lunar junk as the last egg in orbit.','arcade',true],
['toxic-garden-beta','Toxic Garden Beta','Grow mutant plants before zombies eat the roots.','zombie',false],
['glitch-maze-beta','Glitch Maze Beta','A maze that lies, rewrites paths and punishes autopilot.','puzzle',false],
['dead-egg-coming','Dead Egg Coming','An egg horror micro-runner incubating in the lab.','egg',false],
['void-laundry-coming','Void Laundry Coming','Wash cursed clothes in a cosmic laundromat.','weird',false]
]
export const games: Game[] = rawGames.map(([slug,title,shortDescription,category,live],i)=>({id:`game_${i+1}`,slug,title,status: live?'live': i<12?'beta':'coming_soon',shortDescription,fullDescription:`${title} is a fast mobile-first LezGamez arcade experience built for 30 second to 3 minute runs, instant retry, rankings, internal Lez Coins and cosmetic rewards only.`,category,tags:[category,'no-download','mobile','arcade'],thumbnail:`/art/${slug}.webp`,ogImage:`/og/${slug}.png`,isPlayable:Boolean(live),gameUrl:`/games-builds/${slug}/index.html`,gameType:'iframe',supportedDevices:['mobile','desktop'],controls:['touch','mouse','keyboard'],rewardRules:{baseCoins:15+i,dailyCap:250},adRules:{interstitialEveryDeaths:3,banner:true},storeCompatibility:['skins','trails','profile_badges'],releaseDate:'2026-06-28',seoTitle:`Play ${title} Online — LEZGAMEZ`,seoDescription:shortDescription,faq:[{q:`Is ${title} free?`,a:'Yes. LezGamez is ad-supported and Lez Coins are internal credits only.'},{q:'Can I withdraw Lez Coins?',a:'No. Lez Coins cannot be withdrawn, sold, transferred or exchanged for real money.'}],relatedGames:[]}));
export const liveGames = games.filter(g=>g.status==='live');
export const getGame = (slug:string)=>games.find(g=>g.slug===slug);
export const categories = ['weird','zombie','egg','arcade','puzzle','io','physics','no-download'];
