document.addEventListener("DOMContentLoaded", () => {
    const game = document.getElementById("game");
    const player = document.querySelector(".perso");

    const TILE = 32;

    /* ======================
       MONDE
    ====================== */
    const cols = Math.floor(window.innerWidth / TILE);
    const rows = Math.floor(window.innerHeight / TILE);

    const WORLD_WIDTH = cols * TILE;
    const WORLD_HEIGHT = rows * TILE;

    const world = [];
    for (let y = 0; y < rows; y++) {
        world[y] = [];
        for (let x = 0; x < cols; x++) {
            if (y < rows - 3) world[y][x] = 0;        // air
            else if (y === rows - 3) world[y][x] = 2; // herbe
            else if (y === rows - 2) world[y][x] = 1; // terre
            else world[y][x] = 3;                     // pierre
        }
    }

    const types = {
        1: "terre",
        2: "herbe",
        3: "pierre"
    };

    function drawWorld() {
        game.querySelectorAll(".block").forEach(b => b.remove());
        world.forEach((row, y) => {
            row.forEach((v, x) => {
                if (v !== 0) {
                    const b = document.createElement("div");
                    b.className = `block ${types[v]}`;
                    b.style.left = x * TILE + "px";
                    b.style.top = y * TILE + "px";
                    game.appendChild(b);
                }
            });
        });
    }

    drawWorld();

    /* ======================
       JOUEUR
    ====================== */
    let x = 100;
    let y = 0;

    let vx = 0;
    let vy = 0;

    const speed = 6;
    const gravity = 1;
    const jumpForce = 18;

    let onGround = false;

    player.style.left = x + "px";
    player.style.top = y + "px";

    /* ======================
       COLLISIONS
    ====================== */
    function collide(nx, ny) {
        const w = player.offsetWidth;
        const h = player.offsetHeight;

        const points = [
            [nx, ny],
            [nx + w - 1, ny],
            [nx, ny + h - 1],
            [nx + w - 1, ny + h - 1],
        ];

        return points.some(([px, py]) => {
            const gx = Math.floor(px / TILE);
            const gy = Math.floor(py / TILE);
            return world[gy]?.[gx] > 0;
        });
    }

    /* ======================
       INPUT
    ====================== */
    document.addEventListener("keydown", (e) => {
        if (e.key === "q" || e.key === "ArrowLeft") vx = -speed;
        if (e.key === "d" || e.key === "ArrowRight") vx = speed;

        if (e.code === "Space" && onGround) {
            vy = -jumpForce;
            onGround = false;
        }
    });

    document.addEventListener("keyup", (e) => {
        if (
            e.key === "q" || e.key === "ArrowLeft" ||
            e.key === "d" || e.key === "ArrowRight"
        ) {
            vx = 0;
        }
    });

    /* ======================
       BOUCLE DE JEU
    ====================== */
    function update() {
        // gravité
        vy += gravity;

        // déplacement horizontal
        let nx = x + vx;
        if (!collide(nx, y)) {
            x = nx;
        }

        // déplacement vertical
        let ny = y + vy;
        if (!collide(x, ny)) {
            y = ny;
            onGround = false;
        } else {
            if (vy > 0) onGround = true;
            vy = 0;
        }

        // --- COLLISIONS AVEC LES BORDS ---
        if (x < 0) x = 0;

        if (x + player.offsetWidth > WORLD_WIDTH)
            x = WORLD_WIDTH - player.offsetWidth;

        if (y < 0) y = 0;

        if (y + player.offsetHeight > WORLD_HEIGHT) {
            y = WORLD_HEIGHT - player.offsetHeight;
            vy = 0;
            onGround = true;
        }

        player.style.left = x + "px";
        player.style.top = y + "px";

        requestAnimationFrame(update);
    }

    update();
});
