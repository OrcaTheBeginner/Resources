/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
        const variables = {};
        const blocks = [];
        const menus = [];


        function doSound(ab, cd, runtime) {
            const audioEngine = runtime.audioEngine;

            const fetchAsArrayBufferWithTimeout = (url) =>
                new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest();
                    let timeout = setTimeout(() => {
                        xhr.abort();
                        reject(new Error("Timed out"));
                    }, 5000);
                    xhr.onload = () => {
                        clearTimeout(timeout);
                        if (xhr.status === 200) {
                            resolve(xhr.response);
                        } else {
                            reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                        }
                    };
                    xhr.onerror = () => {
                        clearTimeout(timeout);
                        reject(new Error(`Failed to request ${url}`));
                    };
                    xhr.responseType = "arraybuffer";
                    xhr.open("GET", url);
                    xhr.send();
                });

            const soundPlayerCache = new Map();

            const decodeSoundPlayer = async (url) => {
                const cached = soundPlayerCache.get(url);
                if (cached) {
                    if (cached.sound) {
                        return cached.sound;
                    }
                    throw cached.error;
                }

                try {
                    const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                    const soundPlayer = await audioEngine.decodeSoundPlayer({
                        data: {
                            buffer: arrayBuffer,
                        },
                    });
                    soundPlayerCache.set(url, {
                        sound: soundPlayer,
                        error: null,
                    });
                    return soundPlayer;
                } catch (e) {
                    soundPlayerCache.set(url, {
                        sound: null,
                        error: e,
                    });
                    throw e;
                }
            };

            const playWithAudioEngine = async (url, target) => {
                const soundBank = target.sprite.soundBank;

                let soundPlayer;
                try {
                    const originalSoundPlayer = await decodeSoundPlayer(url);
                    soundPlayer = originalSoundPlayer.take();
                } catch (e) {
                    console.warn(
                        "Could not fetch audio; falling back to primitive approach",
                        e
                    );
                    return false;
                }

                soundBank.addSoundPlayer(soundPlayer);
                await soundBank.playSound(target, soundPlayer.id);

                delete soundBank.soundPlayers[soundPlayer.id];
                soundBank.playerTargets.delete(soundPlayer.id);
                soundBank.soundEffects.delete(soundPlayer.id);

                return true;
            };

            const playWithAudioElement = (url, target) =>
                new Promise((resolve, reject) => {
                    const mediaElement = new Audio(url);

                    mediaElement.volume = target.volume / 100;

                    mediaElement.onended = () => {
                        resolve();
                    };
                    mediaElement
                        .play()
                        .then(() => {
                            // Wait for onended
                        })
                        .catch((err) => {
                            reject(err);
                        });
                });

            const playSound = async (url, target) => {
                try {
                    if (!(await Scratch.canFetch(url))) {
                        throw new Error(`Permission to fetch ${url} denied`);
                    }

                    const success = await playWithAudioEngine(url, target);
                    if (!success) {
                        return await playWithAudioElement(url, target);
                    }
                } catch (e) {
                    console.warn(`All attempts to play ${url} failed`, e);
                }
            };

            playSound(ab, cd)
        }
        class Extension {
            getInfo() {
                return {
                    "blockIconURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD8AAAAnCAYAAAC42pApAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAAJdSURBVGhD7Zc/aNtAFMa/djHFwRiR4jTQ2tSTXQrBkGbWVEJGd+uYjOnaLRnirWszJmO3eAxpp85pwQRK8GRjOgSbGmOCTcjUvpOe5MtJtU/Gk+9+IEvveEj3Pb0/8qN8Pv8XhvKYz0ZixZuKFW8qVrypWPGmsjTiU2/PsHVwjAzbOtg3byrJ/9hUjrG1U2SDaNdx+eWEDR+Rghtv0mwRqs/6EV7tltE/fYc79wKll7w+/Imrz4e4Z9PD893ECptAC83aPm696z0UDqrIeddxyL5REonPvPc32jvfRqfBixSMAvbZdpH78BGFbMwGZWGSoNGPT7j+9n3iJweK/RD68Jr7G9exAe9OFauin/b00OeqcEEjEE5UqiR8jM6pvIETdM5bQHYTzyq8FEBCQ1HkN2jTyXmBlL8ArDkUoDH6vwIf4uYwInxetMWnXpdpIy0MZOEKmZIohy7ubnw7pHGFHp3ST13fZnrNGSK6A4yQRmH3DLl1Xlsg+uJXqYaHg4f1GMcUn5VVqVfoIN5yrU6BEwG4oFEmjmTjbBra4u/7Y0pdZ5KSczDqU/onhsqmto1LcYjyQRGlBQVAX/yfLv0W4ah1K3HbFLVdRlZN0coGdWSldueB+osfgDU8UZ7h7y+6Pg39hteoozMEcjtK/YluHwTE86EUrR5JGUJdXIzG9lf01F4wA9HBw3sz/+0rQX9w93hhNonnfDDuQiJzPhh3bBKTccbwCBsrk8O7t/Nw1keeF/ctEKB+gyxyzi8b+mm/hFjxpmLFm4oVbypWvKlY8aZixZuKFW8qBosH/gEffOM4yNYKhQAAAABJRU5ErkJggg==",
                    "id": "constants",
                    "name": "Constant Variables",
                    "color1": "#1f1f1f",
                    "color2": "#000040",
                    "color3": "#2454a0",
                    "tbShow": true,
                    "blocks": blocks
                }
            }
        }
        variables['constants'] = []

    blocks.push({
        opcode: `setconstant`,
        blockType: Scratch.BlockType.COMMAND,
        text: `Const [con] = [setcon]`,
        arguments: {
            "setcon": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Good',
            },
            "con": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo Bars',
            },
        },
        disableMonitor: true
    }); Extension.prototype[`setconstant`] = async (args, util) => {
        if (Boolean(variables['constants'].includes(args.con))) {
            console.error('Already Exists');
            return 'Error: Already Exists'

        } else {
            variables[args.con] = args.setcon
            variables['constants'] = (args.con.push(variables['constants']))

        };
    };

    blocks.push({
        opcode: `returnconst`,
        blockType: Scratch.BlockType.REPORTER,
        text: `Const [sel]`,
        arguments: {
            "sel": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo Bars',
            },
        },
        disableMonitor: true
    }); Extension.prototype[`returnconst`] = async (args, util) => {
        return variables[args.sel]
    };

    blocks.push({
        opcode: `allcon`,
        blockType: Scratch.BlockType.REPORTER,
        text: `All Const`,
        arguments: {},
        disableMonitor: false
    }); Extension.prototype[`allcon`] = async (args, util) => {
        return variables['constants']
    };

    Scratch.extensions.register(new Extension());
})(Scratch);