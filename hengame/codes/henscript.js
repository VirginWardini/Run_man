            const game = document.querySelector(".game");
            const hens = document.querySelectorAll(".hen");
            let currentframe = 0;
            let layingHen = -1;
            let randomHen = Math.floor(Math.random() * hens.length);
            let layFrame = 0;
            const basket = document.querySelector("#basket");
            let eggsCaught = 0;
            const eggCounter = document.querySelector("#eggCounter");
            const pauseBtn = document.querySelector("#Pause");
            let isPaused = true;
            let lives = 3;
            const eggLives = document.querySelector("#eggLives");
            let isGameOver = false;
            const gameOverPopup = document.querySelector("#gameOverPopup");
            const restartBtn = document.querySelector("#restartBtn");
            const startBtn = document.querySelector("#startBtn");
            const startScreen = document.querySelector("#startScreen");
            console.log(restartBtn);
            const buttonSound = new Audio("../sound/button_click.mp3");
            const henSound = new Audio("../sound/hen_lay.mp3");
            henSound.volume = 0.5;
            const eggcatch = new Audio("../sound/egg_catch.mp3");
            eggcatch.volume = 0.5;
            const eggcrack = new Audio("../sound/egg_crack.mp3");
            eggcrack.volume = 0.5;
            const birdpoop = new Audio("../sound/bird_poop.mp3");
            birdpoop.volume = 0.5;
            const gameoverSound = new Audio("../sound/game_over.mp3");
            gameoverSound.volume = 0.5;

            //resize for latops
            function resizeGame() {
                let scaleX = window.innerWidth / 1280;
                let scaleY = window.innerHeight / 720;
                let scale = Math.min(scaleX, scaleY);
                game.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
            window.addEventListener("resize", resizeGame);
            resizeGame();

            //idle frames for hens
            const idleFrames = [
                "../assets/hen_idle/hen_idle_1.png",
                "../assets/hen_idle/hen_idle_2.png",
                "../assets/hen_idle/hen_idle_3.png",
                "../assets/hen_idle/hen_idle_4.png",
                "../assets/hen_idle/hen_idle_5.png"
            ];

            //laying frames for hens
            const layFrames = [
                "../assets/hen_lay/hen_lay_1.png",
                "../assets/hen_lay/hen_lay_2.png",
                "../assets/hen_lay/hen_lay_3.png",
                "../assets/hen_lay/hen_lay_4.png",
                "../assets/hen_lay/hen_lay_5.png"
            ];

            startBtn.addEventListener("click", function() {
                buttonSound.currentTime = 0;
                buttonSound.play();

                isPaused = false;

                startScreen.style.display = "none";

            });
            layingHen = randomHen;

            // Animation loop to update hen frames
            setInterval(function() {

                if (isPaused || isGameOver) {
                    return;
                }
                if (currentframe >= idleFrames.length) {
                    currentframe = 0;
                }
                hens.forEach(function(hen, index) {
                    if (index === layingHen) {
                        hen.src = layFrames[layFrame]
                        layFrame++;;
                    } else {
                        hen.src = idleFrames[currentframe];
                    }
                });

                if (layFrame >= layFrames.length && layingHen !== -1) {
                    henSound.currentTime = 0;
                    henSound.play();
                    createEgg(layingHen);
                    layingHen = -1;
                    scheduleNextHen();
                }
                currentframe++;

            }, 400);


            // Schedule the next hen to lay an egg after a delay
            function scheduleNextHen() {

                setTimeout(function() {
                    if (isGameOver) {
                        return;
                    }         
                    // Reset layFrame
                    layFrame = 0;
                    // Select a random hen
                    layingHen = Math.floor(Math.random() * hens.length);


                }, 3000);

            }

            // Function to create an egg element and position it below the laying hen
            function createEgg(henIndex) {
                //mother hen
                let motherHen = hens[henIndex];
                // create egg element
                let egg = document.createElement("img");

                //randomly select egg type (bronze or poop)
                let randomItem = Math.random();
                let isPoop = false;

                if (randomItem < 0.25) {
                    egg.src = "../assets/poop/Poop.png";
                    isPoop = true;
                } else {
                    egg.src = "../assets/eggs/bronze_egg.png";
                }
                
                //css class for egg
                egg.className = "egg";

                //egg position
                let eggx = motherHen.offsetLeft;
                let eggy = motherHen.offsetTop;
                let eggX = motherHen.offsetLeft + (100 - 35) / 2;
                let eggY = motherHen.offsetTop + motherHen.offsetHeight - 35;

                egg.style.left = eggX + "px";
                egg.style.top = eggY + "px";

                game.appendChild(egg);

                let eggFall = setInterval(function() {
                    if (isPaused || isGameOver) {
                        return;
                    }
                    // Move the egg downward
                    eggY += 5;
                    egg.style.top = eggY + "px";

                    // Get the catching line (top of the basket)
                    let catchLine = basket.offsetTop;

                    // Has the egg reached the basket?
                    if (eggY + egg.offsetHeight >= catchLine) {

                        // Find the left and right edges
                        let eggLeft = egg.offsetLeft;
                        let eggRight = eggLeft + egg.offsetWidth;

                        let basketLeft = basket.offsetLeft;
                        let basketRight = basketLeft + basket.offsetWidth;

                        console.log("Egg:", eggLeft, eggRight);
                        console.log("Basket:", basketLeft, basketRight);
                        
                    // Check whether the object is inside the basket
                    let isCaught =
                        eggLeft >= basketLeft - 7 &&
                        eggRight <= basketRight + 7;

                    if (isCaught && !isPoop) {
                        // CAUGHT EGG 🥚
                        eggsCaught++;
                        eggCounter.textContent = `🥚 Eggs: ${eggsCaught}`;
                        eggcatch.currentTime = 0;
                        eggcatch.play();
                        egg.remove();

                    } else if (isCaught && isPoop) {
                        // CAUGHT POOP 💩
                        lives = Math.max(0, lives - 1);
                        eggLives.textContent = `❤️ Lives: ${lives}`;
                        birdpoop.currentTime = 0;
                        birdpoop.play();
                        egg.remove();

                    } else if (!isCaught && !isPoop) {
                        // MISSED EGG 💥
                        lives = Math.max(0, lives - 1);
                        eggLives.textContent = `❤️ Lives: ${lives}`;

                        egg.src = "../assets/eggs/egg_splat.png";
                        eggcrack.currentTime = 0;
                        eggcrack.play();

                        setTimeout(function() {
                            egg.remove();
                        }, 500);

                    } else {
                        // MISSED POOP 💩
                        // No penalty!
                        egg.remove();
                    }

                    // Check Game Over for BOTH life-loss situations
                    if (lives <= 0) {
                        isGameOver = true;
                        console.log("GAME OVER! 💀");
                        gameoverSound.currentTime = 0;
                        gameoverSound.play();
                        gameOverPopup.style.display = "block";

                        document.getElementById("finalScore").textContent =
                            `Eggs caught: ${eggsCaught}`;
                    }

                    // Stop the falling animation
                    clearInterval(eggFall);

                    }

                }, 30);
            }



            document.addEventListener("keydown", function(event) {

                if (isPaused || isGameOver) {
                    return;
                }

                if (event.key === "ArrowLeft") {
                    let basketX = basket.offsetLeft;
                    basketX -= 10;
                    let maxX = game.offsetWidth - basket.offsetWidth;
                    basketX = Math.max(0, Math.min(basketX, maxX));
                    basket.style.left = basketX + "px";
                } else if (event.key === "ArrowRight") {
                    let basketX = basket.offsetLeft;
                    basketX += 10;
                    let maxX = game.offsetWidth - basket.offsetWidth;
                    basketX = Math.max(0, Math.min(basketX, maxX));
                    basket.style.left = basketX + "px";
                }



            });


            pauseBtn.addEventListener("click", function() {
                if (isGameOver === false && startScreen.style.display === "none") {
                    isPaused = !isPaused;
                    buttonSound.currentTime = 0;
                    buttonSound.play();
                }
            });

            restartBtn.addEventListener("click", function() {
                buttonSound.currentTime = 0;
                buttonSound.play();
                console.log("RESTART BUTTON CLICKED!");

                setTimeout(function() {
                    location.reload();
                }, 250);

            });