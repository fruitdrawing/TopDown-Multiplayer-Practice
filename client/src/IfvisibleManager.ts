import Spriteling, * as spriteling from 'spriteling';
import { SpriteSheet } from 'spriteling/dist/types';
export class IfvisibleManager {
    sprite: Spriteling;
    nn: number = 100;
    constructor() {
        this.sprite = new Spriteling({
            top: 96,
            left: 48,
            cols: 56,
            rows: 20.5
        }, '#spriteTest');


        this.sprite.addScript('idle-east', [
            { sprite: 57, delay: this.nn },
            { sprite: 58, delay: this.nn },
            { sprite: 59, delay: this.nn },
            { sprite: 60, delay: this.nn },
            { sprite: 61, delay: this.nn },
            { sprite: 62, delay: this.nn }
        ])
        this.sprite.addScript('idle-north', [
            { sprite: 63, delay: this.nn },
            { sprite: 64, delay: this.nn },
            { sprite: 65, delay: this.nn },
            { sprite: 66, delay: this.nn },
            { sprite: 67, delay: this.nn },
            { sprite: 68, delay: this.nn }
        ])
        this.sprite.addScript('idle-west', [
            { sprite: 69, delay: this.nn },
            { sprite: 70, delay: this.nn },
            { sprite: 71, delay: this.nn },
            { sprite: 72, delay: this.nn },
            { sprite: 73, delay: this.nn },
            { sprite: 74, delay: this.nn }
        ])
        this.sprite.addScript('idle-south', [
            { sprite: 75, delay: 100 },
            { sprite: 76, delay: 100 },
            { sprite: 77, delay: 100 },
            { sprite: 78, delay: 100 },
            { sprite: 79, delay: 100 },
            { sprite: 80, delay: 100 }
        ]);
        this.sprite.addScript('walk-east', [
            { sprite: 113, delay: 100 },
            { sprite: 114, delay: 100 },
            { sprite: 115, delay: 100 },
            { sprite: 116, delay: 100 },
            { sprite: 117, delay: 100 },
            { sprite: 118, delay: 100 }
        ]);
        this.sprite.addScript('walk-north', [
            { sprite: 119, delay: 100 },
            { sprite: 120, delay: 100 },
            { sprite: 121, delay: 100 },
            { sprite: 122, delay: 100 },
            { sprite: 123, delay: 100 },
            { sprite: 124, delay: 100 }
        ]);
        this.sprite.addScript('walk-west', [
            { sprite: 125, delay: 100 },
            { sprite: 126, delay: 100 },
            { sprite: 127, delay: 100 },
            { sprite: 128, delay: 100 },
            { sprite: 129, delay: 100 },
            { sprite: 130, delay: 100 }
        ]);
        this.sprite.addScript('walk-south', [
            { sprite: 131, delay: 100 },
            { sprite: 132, delay: 100 },
            { sprite: 133, delay: 100 },
            { sprite: 134, delay: 100 },
            { sprite: 135, delay: 100 },
            { sprite: 136, delay: 100 }
        ]);

        this.sprite.addScript('punch-east', [
            { sprite: 841, delay: 100 },
            { sprite: 842, delay: 100 },
            { sprite: 843, delay: 100 },
            { sprite: 844, delay: 100 },
            { sprite: 845, delay: 100 },
            { sprite: 846, delay: 100 }
        ]);
        this.sprite.addScript('punch-north', [
            { sprite: 847, delay: 100 },
            { sprite: 848, delay: 100 },
            { sprite: 849, delay: 100 },
            { sprite: 850, delay: 100 },
            { sprite: 851, delay: 100 },
            { sprite: 852, delay: 100 }
        ]);
        this.sprite.addScript('punch-west', [
            { sprite: 853, delay: 100 },
            { sprite: 854, delay: 100 },
            { sprite: 855, delay: 100 },
            { sprite: 856, delay: 100 },
            { sprite: 857, delay: 100 },
            { sprite: 858, delay: 100 }
        ]);
        this.sprite.addScript('punch-south', [
            { sprite: 859, delay: 100 },
            { sprite: 860, delay: 100 },
            { sprite: 861, delay: 100 },
            { sprite: 862, delay: 100 },
            { sprite: 863, delay: 100 },
            { sprite: 864, delay: 100 }
        ]);

        this.sprite.addScript('damage-east', [
            { sprite: 1121 - 56, delay: 100 },
            { sprite: 1122 - 56, delay: 100 },
            { sprite: 1123 - 56, delay: 100 },
        ]);


        this.sprite.addScript('damage-north', [
            { sprite: 1124 - 56, delay: 100 },
            { sprite: 1125 - 56, delay: 100 },
            { sprite: 1126 - 56, delay: 100 }
        ]);

        this.sprite.addScript('damage-east', [
            { sprite: 1127 - 56, delay: 100 },
            { sprite: 1128 - 56, delay: 100 },
            { sprite: 1129 - 56, delay: 100 }
        ]);


        this.sprite.addScript('damage-south', [
            { sprite: 1130 - 56, delay: 100 },
            { sprite: 1131 - 56, delay: 100 },
            { sprite: 1132 - 56, delay: 100 }
        ]);

        this.sprite.play('damage-east', {
            run: -1,
            delay: 2000
        })


    }

}
