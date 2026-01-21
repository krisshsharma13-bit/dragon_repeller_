let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting = 0;
let  monsterHealth = 0;
let inventory = ["stick"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const weapons = [
    {
        name: "stick",
        power: 5
    },
    {
        name: "dagger",
        power: 30
    },
    {
        name: "claw hammer",
        power: 50
    },
    {
        name: "sword",
        power: 100
    }
];

const monsters = [
    {
        name: "Slime",
        level: 2,
        health: 15
    },
    {
        name: "Fanged beast",
        level: 8,
        health: 60
    },
    {
        name: "Dragon",
        level: 20,
        health: 300
    }
];

const locations = [
    {
        
        "button text": ["Go to Store", "Go to Cave", "Fight a dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You enter the town square. What do you want to do?"
    },
    {
        
        "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go Back"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store. What do you want to do?"
    },
    {
        
        "button text": ["Fight Slime", "Fight fanged beast","Go Back"],
        "button functions": [fightSlime, fightBeast, goTown],  
        text: "You enter the cave. What do you want to do?"
    },
    {
        
        "button text": ["Attack", "Dodge", "Go Back"],
        "button functions": [attack, dodge, goTown],
        text: "You are fighting a monster."
    },
    {
        
        "button text": ["Go to Town", "Go to Town", "Go to Town"],
        "button functions": [goTown, goTown, easterEgg],
        text: "You defeated the monster! You gain gold and experience points."
    },
    {
        
        "button text": [ "Replay", "Replay", "Replay"],
        "button functions": [restart ,restart , restart ],
        text: "You have been defeated! Try again?"
    },
    {
        
        "button text": [ "Replay", "Replay", "Replay"],
        "button functions": [restart ,restart , easterEgg ],
        text: "You have defeated the dragon and freed the town! You win the game! Play again?"
    },
    {
        name : "Easter Egg",
        "button text" : ["2","8","Go Back"],
        "button functions" : [pickTwo, pickEight, goTown],
        text : "You found a secret game. Select a number from above. Ten numbers will be randomly chosen . If the number you select matches one of the random numbers, you win.  "
    }
];



button1.onclick = goStore ;
button2.onclick = goCave ;
button3.onclick = fightDragon ;

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = location["button text"][0];
    button2.innerText = location["button text"][1];
    button3.innerText = location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerText = location.text;   
}

function goTown() {
    update(locations[0]);
}

function goStore() {
    update(locations[1]);
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
    } else {
        text.innerText = "You don't have enough gold to buy health.";
    }
}


function buyWeapon() {
    if(currentWeapon < weapons.length -1){
        if(gold>= 30){
            gold -= 30;
            currentWeapon++;
            goldText.innerText = gold;
            let weaponName = weapons[currentWeapon].name;
            text.innerText = "You bought a " + weaponName + ".";
            inventory.push(weaponName);
            text.innerText += "You now have: " + inventory;
        } else {
            text.innerText = "You don't have enough gold to buy a weapon.";
        }
    } else{
        text.innerText = "You already have the most powerful weapon.";
        button2.innerText = "Sell weapon for 15 gold";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if( inventory.length > 1) {
        gold += 15;
        goldText.innerText = gold;
        let soldWeapon = inventory.pop();
        text.innerText = "You sold a " + soldWeapon + ".";
        text.innerText += "You now have : " + inventory;
    } else {
        text.innerText = "Don't sell your only weapon!";
    }
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsterHealth;
}

function attack() {
    text.innerText = "The " + monsters[fighting].name + " attacks you.";
    text.innerText += "You attacked the " + monsters[fighting].name + ".";

    if(isMonsterhit()){
        health -= getMonsterAttackValue(monsters[fighting].level);
    } else{
        text.innerText += " You missed.";
    }
    
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    healthText.innerText = health;
    monsterHealthText.innerText = monsterHealth;
    if(health <= 0){
        lose();
    } else if (monsterHealth <= 0){
        fighting === 2 ? winGame() : defeatMonster(); 
    }

    if(Math.random() <= .1 && inventory.length !== 1){
        text.innerText += "Your " + inventory.pop() + " breaks.";
        currentWeapon--;
    }
}

function getMonsterAttackValue(level) {
    let hit = (level * 5) - Math.floor(Math.random() * xp);
    console.log(hit);
    return hit;
}

function isMonsterhit() {
    return Math.random() > .2 || health < 20;
}

function dodge() {
    text.innerText = "You dodged the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;
    goldText.innerText = gold;
    xpText.innerText = xp;
    update(locations[4]); 
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;
    goTown();
}

function easterEgg() {
    update(locations[7]);
}

function pickTwo() {
    pick(2);
}
function pickEight() {
    pick(8);
}

function pick(guess){
    let numbers = [];
    while(numbers.length < 10){
        numbers.push(Math.floor(Math.random() * 11));
    }

    text.innerText = "You guessed " + guess + ". Here are the random numbers: \n";

    for(let i = 0; i < 10; i++){
        text.innerText += numbers[i] + "\n";
    }

    if (numbers.indexOf(guess) !== -1){
        text.innerText += "Right! You win 20 Gold.";
        gold += 20;
        goldText.innerText = gold;
    } else {
        text.innerText += "Wrong! You lose 10 health.";
        health -= 10;
        healthText.innerText = health;
        if (health < 10){
            lose();
        }
    }
}
