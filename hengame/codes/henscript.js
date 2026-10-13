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
                createEgg(layingHen);
                layingHen = -1;
                scheduleNextHen();


            }


            currentframe++;

        }, 400);


        // Schedule the next hen to lay an egg after a delay
        function scheduleNextHen() {

            setTimeout(function() {

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
            //image
            egg.src = "../assets/eggs/bronze_egg.png";
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
                    // Check whether the egg fits inside the basket
                    if (eggLeft >= basketLeft - 7 && eggRight <= basketRight + 7) {
                        console.log("EGG CAUGHT! 🧺🥚");
                        eggsCaught++;
                        eggCounter.textContent = `🥚 Eggs: ${eggsCaught}`;
                        egg.remove();
                    } else {
                        egg.src = "../assets/eggs/egg_splat.png";

                        lives = Math.max(0, lives - 1);
                        eggLives.textContent = `❤️ Lives: ${lives}`;
                        if (lives <= 0) {
                            isGameOver = true;
                            console.log("GAME OVER! 💀");
                            gameOverPopup.style.display = "block";
                            document.getElementById("finalScore").textContent = `Eggs caught: ${eggsCaught}`;

                        }
                        setTimeout(function() {
                            egg.remove();
                        }, 500);
                    }
                    // Stop this egg from falling
                    clearInterval(eggFall);
                }

            }, 30);
        }



        document.addEventListener("keydown", function(event) {

            if (event.key === "ArrowLeft") {
                let basketX = basket.offsetLeft;
                basketX -= 10;
                basket.style.left = basketX + "px";
            } else if (event.key === "ArrowRight") {
                let basketX = basket.offsetLeft;
                basketX += 10;
                basket.style.left = basketX + "px";
            }



        });


        pauseBtn.addEventListener("click", function() {
            if (isGameOver === false && startScreen.style.display === "none") {
                isPaused = !isPaused;
            }
        });

        restartBtn.addEventListener("click", function() {
            console.log("RESTART BUTTON CLICKED!");
            location.reload();

        });