document.addEventListener('DOMContentLoaded', () => {
    const background = document.getElementById('background');
    const dialogueBox = document.getElementById('dialogue-box');
    const dialogueText = document.getElementById('dialogue-text');
    const characterPortrait = document.getElementById('character-portrait');
    const signalStrength = document.getElementById('signal-strength');
    const doorHandle = document.getElementById('door-handle');
    const phoenixPainting = document.getElementById('phoenix-painting');
    const overlay = document.querySelector('.overlay');
    let hasFoundPainting = false;

    // Store initial clickable areas
    const initialClickableAreas = {
        zak: { x: 300, y: 600, width: 150, height: 200, dialogue: "Yo, Haru, heard the cleaners chucked some fiery art in the alley trash last night. Wild, right?", portrait: "assets/zak.png", signal: "CRYPT 88.42" },
        rai: { x: 1000, y: 650, width: 200, height: 200, dialogue: "Lost your phoenix painting, huh? Too hot to handle—literally. Check where the garbage stinks.", portrait: "assets/rai.png", signal: "CRYPT 142.17" },
        admin: { x: 1400, y: 400, width: 300, height: 400, dialogue: "The phoenix's eyes see beyond the refuse… seek the void beyond the steam, Haru.", portrait: "assets/admin.jpg", signal: "CRYPT 999.99" },
        alleyExit: { x: 50, y: 400, width: 100, height: 200, action: "transitionToAlley" }
    };

    // Current clickable areas
    let clickableAreas = Object.assign({}, initialClickableAreas);

    // Add door handle click event
    doorHandle.addEventListener('click', () => {
        transitionToAlley();
    });

    // Add click events for closing fullscreen painting
    overlay.addEventListener('click', closeFullscreenPainting);
    phoenixPainting.addEventListener('click', closeFullscreenPainting);

    function closeFullscreenPainting() {
        if (phoenixPainting.classList.contains('fullscreen')) {
            phoenixPainting.classList.remove('fullscreen');
            overlay.classList.remove('visible');
            setTimeout(() => {
                phoenixPainting.classList.add('reveal');
            }, 500);
        }
    }

    background.addEventListener('click', (e) => {
        const rect = background.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (const [id, area] of Object.entries(clickableAreas)) {
            if (x >= area.x && x <= area.x + area.width && y >= area.y && y <= area.y + area.height) {
                if (area.dialogue) {
                    dialogueBox.style.display = 'block';
                    characterPortrait.src = area.portrait;
                    dialogueText.textContent = area.dialogue;
                    signalStrength.textContent = area.signal;
                    setTimeout(() => dialogueBox.style.display = 'none', 3000);
                } else if (area.action === 'transitionToAlley') {
                    transitionToAlley();
                } else if (area.action === 'transitionToShop') {
                    transitionToShop();
                } else if (area.action === 'revealPainting' && !hasFoundPainting) {
                    revealPhoenixPainting();
                }
            }
        }
    });

    function revealPhoenixPainting() {
        hasFoundPainting = true;
        phoenixPainting.classList.remove('hidden');
        phoenixPainting.style.display = 'block';
        overlay.classList.add('visible');
        
        setTimeout(() => {
            phoenixPainting.classList.add('fullscreen');
        }, 50);
        
        dialogueBox.style.display = 'block';
        characterPortrait.src = 'assets/admin.jpg';
        dialogueText.textContent = "The phoenix rises from the ashes! My painting... it's here!";
        signalStrength.textContent = "CRYPT 777.77";
        setTimeout(() => dialogueBox.style.display = 'none', 3000);
    }

    function transitionToAlley() {
        background.src = 'assets/alley.webp';
        doorHandle.style.display = 'none';
        phoenixPainting.style.display = 'none';
        phoenixPainting.classList.remove('reveal');
        phoenixPainting.classList.remove('fullscreen');
        
        // Update Haru for alley scene
        const haru = document.getElementById('haru');
        if (haru) {
            haru.src = 'Assets/haru-standing3.png';
            haru.style.display = 'block';
            haru.classList.add('alley-position');
        }
        
        // Remove existing debug garbage if any
        const existingGarbage = document.querySelector('.debug-garbage');
        if (existingGarbage) {
            existingGarbage.remove();
        }
        
        // Create visible clickable area for garbage
        const debugGarbage = document.createElement('div');
        debugGarbage.className = 'debug-garbage clickable';
        debugGarbage.style.position = 'absolute';
        debugGarbage.style.left = '500px';
        debugGarbage.style.top = '700px';
        debugGarbage.style.width = '150px';
        debugGarbage.style.height = '150px';
        debugGarbage.style.border = '2px solid red';
        debugGarbage.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
        debugGarbage.style.zIndex = '99';
        debugGarbage.textContent = 'Click here for painting';
        debugGarbage.style.color = 'white';
        debugGarbage.style.display = 'flex';
        debugGarbage.style.alignItems = 'center';
        debugGarbage.style.justifyContent = 'center';
        debugGarbage.style.textAlign = 'center';
        debugGarbage.style.fontSize = '14px';
        debugGarbage.style.padding = '10px';
        debugGarbage.style.cursor = 'pointer';
        document.getElementById('game-container').appendChild(debugGarbage);

        // Add direct click event to the garbage area
        debugGarbage.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!hasFoundPainting) {
                revealPhoenixPainting();
            }
        });
        
        // Update clickable areas to match position
        clickableAreas = {
            backToShop: { x: 1700, y: 400, width: 100, height: 200, action: "transitionToShop" },
            garbage: { x: 500, y: 700, width: 150, height: 150, action: "revealPainting" }
        };
    }

    function transitionToShop() {
        background.src = 'assets/ramen-shop.jpg';
        doorHandle.style.display = 'block';
        
        // Reset Haru's image and position for shop scene
        const haru = document.getElementById('haru');
        if (haru) {
            haru.src = 'Assets/haru-standing3.png';
            haru.style.display = 'block';
            haru.classList.remove('alley-position');
        }
        
        if (hasFoundPainting) {
            phoenixPainting.style.display = 'block';
            phoenixPainting.classList.add('reveal');
        }
        // Reset clickable areas for shop
        clickableAreas = Object.assign({}, initialClickableAreas);
    }
}); 