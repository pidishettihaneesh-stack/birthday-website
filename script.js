document.addEventListener("DOMContentLoaded", () => {

    const enterButton = document.getElementById("enterButton");
    const letterButton = document.getElementById("letterButton");

    const tapBlowButton =
        document.getElementById("tapBlowButton");

    const candleScreen =
        document.getElementById("candleScreen");

    const blowText =
        document.getElementById("blowText");


    // =========================
    // SCREEN 1 → SCREEN 2
    // =========================

    if (enterButton) {

        enterButton.addEventListener("click", () => {

            document.body.classList.add("birthday-active");

        });

    }


    // =========================
    // SCREEN 2 → SCREEN 3
    // =========================

    if (letterButton) {

        letterButton.addEventListener("click", () => {

            document.body.classList.add("candle-active");

        });

    }


    // =========================
    // BLOW CANDLE
    // =========================

    function blowCandle() {

        if (
            candleScreen.classList.contains("candle-blown")
        ) {
            return;
        }

        candleScreen.classList.add("candle-blown");

        blowText.innerHTML =
            "The candle is blown... ❤️";

        tapBlowButton.innerHTML =
            "Continue 💌";

        if (window.audioStream) {

            window.audioStream
                .getTracks()
                .forEach(track => track.stop());

        }

    }


    // =========================
    // MICROPHONE DETECTION
    // =========================

    async function startListening() {

        try {

            blowText.innerHTML =
                "I'm listening... now blow 💨";


            const stream =
                await navigator.mediaDevices.getUserMedia({
                    audio: true
                });


            window.audioStream = stream;


            const audioContext =
                new AudioContext();


            const analyser =
                audioContext.createAnalyser();

            analyser.fftSize = 512;


            const microphone =
                audioContext.createMediaStreamSource(stream);

            microphone.connect(analyser);


            const data =
                new Uint8Array(analyser.fftSize);


            function detectBlow() {

                if (
                    candleScreen.classList.contains(
                        "candle-blown"
                    )
                ) {
                    return;
                }


                analyser.getByteTimeDomainData(data);


                let sum = 0;


                for (
                    let i = 0;
                    i < data.length;
                    i++
                ) {

                    const value =
                        (data[i] - 128) / 128;

                    sum += value * value;

                }


                const volume =
                    Math.sqrt(
                        sum / data.length
                    );


                if (volume > 0.08) {

                    blowCandle();

                    return;

                }


                requestAnimationFrame(
                    detectBlow
                );

            }


            detectBlow();

        } catch (error) {

            console.log(
                "Microphone unavailable:",
                error
            );


            blowText.innerHTML =
                "Microphone unavailable — tap to blow 💨";

        }

    }


    // =========================
    // BLOW / CONTINUE BUTTON
    // =========================

    if (tapBlowButton) {

        tapBlowButton.addEventListener(
            "click",
            () => {

                if (
                    candleScreen.classList.contains(
                        "candle-blown"
                    )
                ) {

                    document.body.classList.add(
                        "letter-active"
                    );

                } else {

                    startListening();

                }

            }
        );

    }

// =========================
// SCREEN 4 → SCREEN 5
// =========================

// =========================
// OPEN ACTUAL LETTER
// =========================

const envelopeWrapper =
    document.getElementById("envelopeWrapper");

const actualLetter =
    document.getElementById("actualLetter");

const letterDoneButton =
    document.getElementById("letterDoneButton");


if (envelopeWrapper) {

    envelopeWrapper.addEventListener("click", () => {

        document.body.classList.add("letter-opened");

        setTimeout(() => {

            actualLetter.classList.add("show-letter");

        }, 500);

    });

}


if (letterDoneButton) {

    letterDoneButton.addEventListener("click", () => {

        document.body.classList.add("memories-active");

    });

}

// =========================
// SCREEN 5 → SCREEN 6
// =========================

const memoryNextButton =
    document.getElementById("memoryNextButton");

if (memoryNextButton) {

    memoryNextButton.addEventListener("click", () => {

        document.body.classList.add("final-active");

    });

}

});