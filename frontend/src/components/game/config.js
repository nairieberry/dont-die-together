export const emptyState = {
    players: { },
    enemies: { },
    bullets: { },
    items: { }
};

export const newPlayer = {
    pos: {
        x: 600,
        y: 400
    },
    velocity: {
        x: 0,
        y: 0
    },
    health: 100,
    timeToFire: 0,   //time until able to fire
    timeToSwitch: 0,
    weapon: 'pistol',
    items: {
        guns: {
            pistol: true,
            shotgun: true,
            rifle: true
        },
        gunAmmo: {
            pistol: 1000000,
            shotgun: 1000000,
            rifle: 1000000
        }
    },
    ammo: 20,
}

export const canvasStyle = {
    display: 'block',
    backgroundColor: '#A9A9A9',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const screenWidth = 1200;
export const screenHeight = 800;