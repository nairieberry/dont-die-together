export const initialState = {
    players: { },
    enemies: { },
    bullets: { },
    items: { }
};

export const newPlayer = {
    pos: {
        x: 100,
        y: 100
    },
    health: 100,
    timeToFire: 0,   //time until able to fire
    weapon: 'pistol',
    ammo: 10
}

export const canvasStyle = {
    display: 'block',
    backgroundColor: '#A9A9A9',
    marginLeft: 'auto',
    marginRight: 'auto'
};

export const screenWidth = 800;
export const screenHeight = 600;