# _E-Beat Management System for Goa Police_

#### Architecture

![Architecture](https://imgur.com/a/lJOBBFn)

<ul>
  <li>The Card class represents a playing card with a suit and rank.</li>
  <li>The Player class represents a player in the game with an id, a hand of cards, and methods for drawing and playing cards.</li>
  <li>The Game class represents the game itself with properties for the players, draw pile, discard pile, current player index, and direction of play. The Game class also has methods for starting the game, shuffling the draw pile, checking if the game is over or ended in a draw, and determining the winner.</li>
</ul>

This object-oriented design pattern allows us to organize our code into modular and reusable classes that can be easily tested and extended. It also makes it easier to reason about the behavior of our code by separating concerns into different classes.

<hr/>

## Steps To Run The Game

### Step 1:

```bash
cd card-game
```

Make sure you are in correct directory (ie. card-game).

## Step 2:

```bash
node index.js
```

Now you will be asked to enter 'How many players? (2-4)'
You can enter any number between 2 and 4 (both inclusive).

<hr/>

## Steps To Run Unit Test Cases

### Step 1:

```bash
cd card-game/test
```

Make sure you are in correct directory (ie. card-game/test).

## Step 2:

For running Card test cases:

```bash
node card.test.js
```

For running Player test cases:

```bash
node player.test.js
```

For running Game test cases:

```bash
node game.test.js
```

<hr/>

# Screenshots

### Gameplay for 4 players

![image1](/screenshots/1.png)

![image1](/screenshots/2.png)

![image1](/screenshots/3.png)
