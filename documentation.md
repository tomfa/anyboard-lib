## Members
<dl>
<dt><a href="#AnyBoard">AnyBoard</a> : <code>object</code></dt>
<dd><p>Global variable AnyBoard.</p>
</dd>
</dl>
## Typedefs
<dl>
<dt><a href="#playDrawCallback">playDrawCallback</a> : <code>function</code></dt>
<dd><p>This type of callback will be called when card is drawn or played</p>
</dd>
<dt><a href="#simpleEventCallback">simpleEventCallback</a> : <code>function</code></dt>
<dd><p>Type of callback called upon triggering of events</p>
</dd>
<dt><a href="#tokenTokenEventCallback">tokenTokenEventCallback</a> : <code>function</code></dt>
<dd><p>Type of callback called upon token-token events, i.e. when two tokens interact with eachother, wuch
as &#39;STACK_ON&#39;, &#39;NEXT_TO&#39;</p>
</dd>
<dt><a href="#tokenEventCallback">tokenEventCallback</a> : <code>function</code></dt>
<dd><p>Type of callback called upon triggering of a Token event, i.e. events triggered by the physical interaction
with tokens, such as &#39;LIFT&#39;, &#39;SHAKE&#39;, &#39;TURN&#39;</p>
</dd>
<dt><a href="#tokenConstraintEventCallback">tokenConstraintEventCallback</a> : <code>function</code></dt>
<dd><p>Type of callback called upon triggering of a Token-Constraint event, i.e. events triggered by the physical interaction
of a token upon a constraint, such as &#39;MOVED_TO&#39;</p>
</dd>
<dt><a href="#stdStringCallback">stdStringCallback</a> : <code>function</code></dt>
<dd><p>Generic callback returning a string param</p>
</dd>
<dt><a href="#stdBoolCallback">stdBoolCallback</a> : <code>function</code></dt>
<dd><p>Generic callback returning a bool param</p>
</dd>
<dt><a href="#stdNoParamCallback">stdNoParamCallback</a> : <code>function</code></dt>
<dd><p>Generic callback without params</p>
</dd>
<dt><a href="#onScanCallback">onScanCallback</a> : <code>function</code></dt>
<dd><p>Type of callback called upon detecting a token</p>
</dd>
<dt><a href="#stdErrorCallback">stdErrorCallback</a> : <code>function</code></dt>
<dd><p>This type of callback will be called upon failure to complete a function</p>
</dd>
</dl>
<a name="AnyBoard"></a>
## AnyBoard : <code>object</code>
Global variable AnyBoard.

**Kind**: global variable  

* [AnyBoard](#AnyBoard) : <code>object</code>
  * [.Driver](#AnyBoard.Driver)
    * [new AnyBoard.Driver(options)](#new_AnyBoard.Driver_new)
    * [.toString()](#AnyBoard.Driver+toString) ⇒ <code>string</code>
  * [.Deck](#AnyBoard.Deck)
    * [new AnyBoard.Deck(name, jsonDeck)](#new_AnyBoard.Deck_new)
    * _instance_
      * [.shuffle()](#AnyBoard.Deck+shuffle)
      * [.refill([newDeck])](#AnyBoard.Deck+refill)
      * [.onPlay(func)](#AnyBoard.Deck+onPlay)
      * [.onDraw(callback)](#AnyBoard.Deck+onDraw)
      * [.toString()](#AnyBoard.Deck+toString) ⇒ <code>string</code>
    * _static_
      * [.get(name)](#AnyBoard.Deck.get) ⇒ <code>[Deck](#AnyBoard.Deck)</code>
  * [.Card](#AnyBoard.Card)
    * [new AnyBoard.Card(deck, options)](#new_AnyBoard.Card_new)
    * _instance_
      * [.onPlay(func)](#AnyBoard.Card+onPlay)
      * [.onDraw(callback)](#AnyBoard.Card+onDraw)
      * [.toString()](#AnyBoard.Card+toString) ⇒ <code>string</code>
    * _static_
      * [.get(cardTitleOrID)](#AnyBoard.Card.get) ⇒ <code>[Card](#AnyBoard.Card)</code>
  * [.Dice](#AnyBoard.Dice)
    * [new AnyBoard.Dice([eyes], [numOfDice])](#new_AnyBoard.Dice_new)
    * [.roll()](#AnyBoard.Dice+roll) ⇒ <code>number</code>
    * [.rollEach()](#AnyBoard.Dice+rollEach) ⇒ <code>Array</code>
  * [.Player](#AnyBoard.Player)
    * [new AnyBoard.Player(name, [options])](#new_AnyBoard.Player_new)
    * _instance_
      * [.pay(resources, [receivingPlayer])](#AnyBoard.Player+pay) ⇒ <code>boolean</code>
      * [.trade(giveResources, receiveResources, [player])](#AnyBoard.Player+trade) ⇒ <code>boolean</code>
      * [.recieve(resourceSet)](#AnyBoard.Player+recieve)
      * [.draw(deck, [options])](#AnyBoard.Player+draw) ⇒ <code>[Card](#AnyBoard.Card)</code>
      * [.play(card, [customOptions])](#AnyBoard.Player+play) ⇒ <code>boolean</code>
      * [.toString()](#AnyBoard.Player+toString) ⇒ <code>string</code>
    * _static_
      * [.get(name)](#AnyBoard.Player.get) ⇒ <code>[Player](#AnyBoard.Player)</code>
  * [.Hand](#AnyBoard.Hand)
    * [new AnyBoard.Hand(player, [options])](#new_AnyBoard.Hand_new)
    * [.has(card, [amount])](#AnyBoard.Hand+has) ⇒ <code>boolean</code>
    * [.discardHand()](#AnyBoard.Hand+discardHand)
    * [.discardCard(card)](#AnyBoard.Hand+discardCard)
    * [.toString()](#AnyBoard.Hand+toString) ⇒ <code>string</code>
  * [.Resource](#AnyBoard.Resource)
    * [new AnyBoard.Resource(name, [properties])](#new_AnyBoard.Resource_new)
    * [.get(name)](#AnyBoard.Resource.get) ⇒ <code>[Resource](#AnyBoard.Resource)</code>
  * [.ResourceSet](#AnyBoard.ResourceSet)
    * [new AnyBoard.ResourceSet([resources], [allowNegative])](#new_AnyBoard.ResourceSet_new)
    * [.contains(reqResource)](#AnyBoard.ResourceSet+contains) ⇒ <code>boolean</code>
    * [.add(resourceSet)](#AnyBoard.ResourceSet+add)
    * [.subtract(resourceSet)](#AnyBoard.ResourceSet+subtract) ⇒ <code>boolean</code>
    * [.similarities(resourceSet)](#AnyBoard.ResourceSet+similarities) ⇒ <code>object</code>
  * [.BaseToken](#AnyBoard.BaseToken)
    * [new AnyBoard.BaseToken(name, address, device, [driver])](#new_AnyBoard.BaseToken_new)
    * _instance_
      * [.isConnected()](#AnyBoard.BaseToken+isConnected) ⇒ <code>boolean</code>
      * [.connect([win], [fail])](#AnyBoard.BaseToken+connect)
      * [.disconnect()](#AnyBoard.BaseToken+disconnect)
      * [.trigger(eventName, [eventOptions])](#AnyBoard.BaseToken+trigger)
      * [.on(eventName, callbackFunction)](#AnyBoard.BaseToken+on)
      * [.once(eventName, callbackFunction)](#AnyBoard.BaseToken+once)
      * [.send(data, [win], [fail])](#AnyBoard.BaseToken+send)
      * [.print(value, [win], [fail])](#AnyBoard.BaseToken+print)
      * [.getFirmwareName([win], [fail])](#AnyBoard.BaseToken+getFirmwareName)
      * [.getFirmwareVersion([win], [fail])](#AnyBoard.BaseToken+getFirmwareVersion)
      * [.getFirmwareUUID([win], [fail])](#AnyBoard.BaseToken+getFirmwareUUID)
      * [.hasLed([win], [fail])](#AnyBoard.BaseToken+hasLed)
      * [.hasLedColor([win], [fail])](#AnyBoard.BaseToken+hasLedColor)
      * [.hasVibration([win], [fail])](#AnyBoard.BaseToken+hasVibration)
      * [.hasColorDetection([win], [fail])](#AnyBoard.BaseToken+hasColorDetection)
      * [.hasLedScreen([win], [fail])](#AnyBoard.BaseToken+hasLedScreen)
      * [.hasRfid([win], [fail])](#AnyBoard.BaseToken+hasRfid)
      * [.hasNfc([win], [fail])](#AnyBoard.BaseToken+hasNfc)
      * [.hasAccelometer([win], [fail])](#AnyBoard.BaseToken+hasAccelometer)
      * [.hasTemperature([win], [fail])](#AnyBoard.BaseToken+hasTemperature)
      * [.ledOn(value, [win], [fail])](#AnyBoard.BaseToken+ledOn)
      * [.ledBlink(value, [win], [fail])](#AnyBoard.BaseToken+ledBlink)
      * [.ledOff([win], [fail])](#AnyBoard.BaseToken+ledOff)
      * [.toString()](#AnyBoard.BaseToken+toString) ⇒ <code>string</code>
    * _static_
      * [.setDefaultDriver(driver)](#AnyBoard.BaseToken.setDefaultDriver) ⇒ <code>boolean</code>
  * [.Drivers](#AnyBoard.Drivers) : <code>Object</code>
    * [.get(name)](#AnyBoard.Drivers.get) ⇒ <code>[Driver](#AnyBoard.Driver)</code> &#124; <code>undefined</code>
    * [.getCompatibleDriver(type, compatibility)](#AnyBoard.Drivers.getCompatibleDriver) ⇒ <code>[Driver](#AnyBoard.Driver)</code>
  * [.TokenManager](#AnyBoard.TokenManager)
    * [.setDriver(driver)](#AnyBoard.TokenManager.setDriver)
    * [.scan([win], [fail], [timeout])](#AnyBoard.TokenManager.scan)
    * [.get(address)](#AnyBoard.TokenManager.get) ⇒ <code>[BaseToken](#AnyBoard.BaseToken)</code>
    * [.onTokenTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onTokenTokenEvent)
    * [.onceTokenTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onceTokenTokenEvent)
    * [.onTokenConstraintEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onTokenConstraintEvent)
    * [.onceTokenConstraintEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onceTokenConstraintEvent)
    * [.onTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onTokenEvent)
    * [.onceTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onceTokenEvent)
  * [.Logger](#AnyBoard.Logger)
    * [.warn(message, [sender])](#AnyBoard.Logger.warn)
    * [.error(message, [sender])](#AnyBoard.Logger.error)
    * [.log(message, [sender])](#AnyBoard.Logger.log)
    * [.debug(message, [sender])](#AnyBoard.Logger.debug)
    * [.setThreshold(severity)](#AnyBoard.Logger.setThreshold)
  * [.Utils](#AnyBoard.Utils)
    * [.isEqual(a, b, [aStack], [bStack])](#AnyBoard.Utils.isEqual) ⇒ <code>boolean</code>

<a name="AnyBoard.Driver"></a>
### AnyBoard.Driver
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the driver |
| description | <code>string</code> | description of the driver |
| version | <code>string</code> | version of the driver |
| dependencies | <code>string</code> | Text describing what, if anything, the driver depends on. |
| date | <code>string</code> | Date upon release/last build. |
| type | <code>Array</code> | Array of string describing    Type of driver, e.g. "bluetooth" |
| compatibility | <code>Array</code> &#124; <code>object</code> &#124; <code>string</code> | An object or string that can be used to deduce compatibiity, or      an array of different compatibilies. |
| properties | <code>object</code> | dictionary that holds custom attributes |


* [.Driver](#AnyBoard.Driver)
  * [new AnyBoard.Driver(options)](#new_AnyBoard.Driver_new)
  * [.toString()](#AnyBoard.Driver+toString) ⇒ <code>string</code>

<a name="new_AnyBoard.Driver_new"></a>
#### new AnyBoard.Driver(options)
Represents a single Driver, e.g. for spesific token or bluetooth discovery


| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options for the driver |
| options.name | <code>string</code> | name of the driver |
| options.description | <code>string</code> | description of the driver |
| options.version | <code>string</code> | version of the driver |
| options.type | <code>string</code> | Type of driver, e.g. "bluetooth" |
| options.compatibility | <code>Array</code> &#124; <code>object</code> &#124; <code>string</code> | An object or string that can be used to deduce compatibiity, or      an array of different compatibilies. How this is used is determined by the set standard driver on TokenManager      that handles scanning for and connecting to tokens. |
| [options.dependencies] | <code>string</code> | *(optional)* What if anything the driver depends on. |
| [options.date] | <code>string</code> | *(optional)* Date upon release/last build. |
| options.yourAttributeHere | <code>any</code> | custom attributes, as well as specified ones, are all placed in      driver.properties. E.g. 'heat' would be placed in driver.properties.heat. |

<a name="AnyBoard.Driver+toString"></a>
#### driver.toString() ⇒ <code>string</code>
Returns a short description of the Driver instance

**Kind**: instance method of <code>[Driver](#AnyBoard.Driver)</code>  
<a name="AnyBoard.Deck"></a>
### AnyBoard.Deck
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of Deck. |
| cards | <code>[Array.&lt;Card&gt;](#AnyBoard.Card)</code> | complete set of cards in the deck |
| pile | <code>[Array.&lt;Card&gt;](#AnyBoard.Card)</code> | remaining cards in this pile |
| usedPile | <code>[Array.&lt;Card&gt;](#AnyBoard.Card)</code> | cards played from this deck |
| autoUsedRefill | <code>boolean</code> | *(default: true)* whether or not to automatically refill pile from usedPile when empty. Is ignored if autoNewRefill is true. |
| autoNewRefill | <code>boolean</code> | *(default: false)* whether or not to automatically refill pile with a whole new deck when empty. |
| playListeners | <code>[Array.&lt;playDrawCallback&gt;](#playDrawCallback)</code> | holds functions to be called when cards in this deck are played |
| drawListeners | <code>[Array.&lt;playDrawCallback&gt;](#playDrawCallback)</code> | holds functions to be called when cards in this deck are drawn |


* [.Deck](#AnyBoard.Deck)
  * [new AnyBoard.Deck(name, jsonDeck)](#new_AnyBoard.Deck_new)
  * _instance_
    * [.shuffle()](#AnyBoard.Deck+shuffle)
    * [.refill([newDeck])](#AnyBoard.Deck+refill)
    * [.onPlay(func)](#AnyBoard.Deck+onPlay)
    * [.onDraw(callback)](#AnyBoard.Deck+onDraw)
    * [.toString()](#AnyBoard.Deck+toString) ⇒ <code>string</code>
  * _static_
    * [.get(name)](#AnyBoard.Deck.get) ⇒ <code>[Deck](#AnyBoard.Deck)</code>

<a name="new_AnyBoard.Deck_new"></a>
#### new AnyBoard.Deck(name, jsonDeck)
Represents a Deck of Cards


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of Deck. This name can be used to retrieve the deck via AnyBoard.Deck.all[name]. |
| jsonDeck | <code>object</code> | loaded JSON file. See [examples/deck-loading/](./examples/deck-loading) for JSON format and loading. |

<a name="AnyBoard.Deck+shuffle"></a>
#### deck.shuffle()
Shuffles the pile of undrawn cards   .
Pile is automatically shuffled upon construction, and upon initiate().
New cards added upon refill() are also automatically shuffled.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  
<a name="AnyBoard.Deck+refill"></a>
#### deck.refill([newDeck])
Manually refills the pile. This is not necessary if autoUsedRefill or autoNewRefill property of deck is true.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [newDeck] | <code>boolean</code> | <code>false</code> | True if to refill with a new deck. False if to refill with played cards (from usedPile) |

<a name="AnyBoard.Deck+onPlay"></a>
#### deck.onPlay(func)
Adds functions to be executed upon all Cards in this Deck.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>[playDrawCallback](#playDrawCallback)</code> | callback function to be executed upon play of card from this deck |

<a name="AnyBoard.Deck+onDraw"></a>
#### deck.onDraw(callback)
Adds functions to be executed upon draw of Card from this Deck

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>[playDrawCallback](#playDrawCallback)</code> | function to be executed with the 3 parameters AnyBoard.Card, AnyBoard.Player, (options) when cards are drawn |

<a name="AnyBoard.Deck+toString"></a>
#### deck.toString() ⇒ <code>string</code>
Sting representation of a deck

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  
<a name="AnyBoard.Deck.get"></a>
#### Deck.get(name) ⇒ <code>[Deck](#AnyBoard.Deck)</code>
Returns deck with given name

**Kind**: static method of <code>[Deck](#AnyBoard.Deck)</code>  
**Returns**: <code>[Deck](#AnyBoard.Deck)</code> - deck with given name (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of deck |

<a name="AnyBoard.Card"></a>
### AnyBoard.Card
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| title | <code>string</code> | title of the card. |
| description | <code>string</code> | description for the Card |
| color | <code>string</code> | color of the Card |
| category | <code>string</code> | category of the card, not used by AnyBoard FrameWork |
| value | <code>number</code> | value of the card, not used by AnyBoard FrameWork |
| type | <code>string</code> | type of the card, not used by AnyBoard FrameWork |
| amount | <code>number</code> | amount of this card its deck |
| deck | <code>[Deck](#AnyBoard.Deck)</code> | deck that this card belongs to |
| playListeners | <code>[Array.&lt;playDrawCallback&gt;](#playDrawCallback)</code> | holds functions to be called upon play of this spesific card (before potential playListeners on its belonging deck) |
| drawListeners | <code>[Array.&lt;playDrawCallback&gt;](#playDrawCallback)</code> | holds functions to be called upon draw of this spesific card (before potential drawListeners on its belonging deck) |
| properties | <code>object</code> | dictionary that holds custom attributes |


* [.Card](#AnyBoard.Card)
  * [new AnyBoard.Card(deck, options)](#new_AnyBoard.Card_new)
  * _instance_
    * [.onPlay(func)](#AnyBoard.Card+onPlay)
    * [.onDraw(callback)](#AnyBoard.Card+onDraw)
    * [.toString()](#AnyBoard.Card+toString) ⇒ <code>string</code>
  * _static_
    * [.get(cardTitleOrID)](#AnyBoard.Card.get) ⇒ <code>[Card](#AnyBoard.Card)</code>

<a name="new_AnyBoard.Card_new"></a>
#### new AnyBoard.Card(deck, options)
Represents a single Card
Should be instantiated in bulk by calling the deck constructor


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| deck | <code>[Deck](#AnyBoard.Deck)</code> |  | deck to which the card belongs |
| options | <code>object</code> |  | options for the card |
| options.title | <code>string</code> |  | title of the card. |
| options.description | <code>string</code> |  | description for the Card |
| [options.color] | <code>string</code> |  | *(optional)* color of the Card |
| [options.category] | <code>string</code> |  | *(optional)* category of the card, not used by AnyBoard FrameWork |
| [options.value] | <code>number</code> |  | *(optional)* value of the card, not used by AnyBoard FrameWork |
| [options.type] | <code>string</code> |  | *(optional)* type of the card, not used by AnyBoard FrameWork |
| [options.amount] | <code>number</code> | <code>1</code> | amount of this card in the deck |
| [options.yourAttributeHere] | <code>any</code> |  | custom attributes, as well as specified ones, are all placed in card.properties. E.g. 'heat' would be placed in card.properties.heat. |

<a name="AnyBoard.Card+onPlay"></a>
#### card.onPlay(func)
Adds functions to be executed upon a play of this card

**Kind**: instance method of <code>[Card](#AnyBoard.Card)</code>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>[playDrawCallback](#playDrawCallback)</code> | callback function to be executed upon play of card from this deck |

<a name="AnyBoard.Card+onDraw"></a>
#### card.onDraw(callback)
Adds functions to be executed upon a draw of this card

**Kind**: instance method of <code>[Card](#AnyBoard.Card)</code>  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>[playDrawCallback](#playDrawCallback)</code> | function to be executed upon play of card from this deck |

<a name="AnyBoard.Card+toString"></a>
#### card.toString() ⇒ <code>string</code>
Returns a string representation of the card.

**Kind**: instance method of <code>[Card](#AnyBoard.Card)</code>  
<a name="AnyBoard.Card.get"></a>
#### Card.get(cardTitleOrID) ⇒ <code>[Card](#AnyBoard.Card)</code>
Returns card with given id

**Kind**: static method of <code>[Card](#AnyBoard.Card)</code>  
**Returns**: <code>[Card](#AnyBoard.Card)</code> - card with given id (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| cardTitleOrID | <code>number</code> &#124; <code>string</code> | id or title of card |

<a name="AnyBoard.Dice"></a>
### AnyBoard.Dice
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  

* [.Dice](#AnyBoard.Dice)
  * [new AnyBoard.Dice([eyes], [numOfDice])](#new_AnyBoard.Dice_new)
  * [.roll()](#AnyBoard.Dice+roll) ⇒ <code>number</code>
  * [.rollEach()](#AnyBoard.Dice+rollEach) ⇒ <code>Array</code>

<a name="new_AnyBoard.Dice_new"></a>
#### new AnyBoard.Dice([eyes], [numOfDice])
Represents a set of game dices that can be rolled to retrieve a random result.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [eyes] | <code>number</code> | <code>6</code> | number of max eyes on a roll with this dice |
| [numOfDice] | <code>number</code> | <code>1</code> | number of dices |

**Example**  
```js
// will create 1 dice, with 6 eyes
var dice = new AnyBoard.Dice();

// will create 2 dice, with 18 eyes
var dice = new AnyBoard.Dice(18, 2);
```
<a name="AnyBoard.Dice+roll"></a>
#### dice.roll() ⇒ <code>number</code>
Roll the dices and returns a the sum

**Kind**: instance method of <code>[Dice](#AnyBoard.Dice)</code>  
**Returns**: <code>number</code> - combined result of rolls for all dices  
**Example**  
```js
var dice = new AnyBoard.Dice();

// returns random number between 1 and 6
dice.roll()
```
**Example**  
```js
var dice = new AnyBoard.Dice(12, 2);

// returns random number between 2 and 24
dice.roll()
```
<a name="AnyBoard.Dice+rollEach"></a>
#### dice.rollEach() ⇒ <code>Array</code>
Roll the dices and returns an array of results for each dice

**Kind**: instance method of <code>[Dice](#AnyBoard.Dice)</code>  
**Returns**: <code>Array</code> - list of results for each dice  
**Example**  
```js
var dice = new AnyBoard.Dice(8, 2);

// returns an Array of numbers
var resultArray = dice.rollEach()

// result of first dice, between 1-8
resultArray[0]

// result of second dice, between 1-8
resultArray[1]
```
<a name="AnyBoard.Player"></a>
### AnyBoard.Player
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hand | <code>[Hand](#AnyBoard.Hand)</code> | hand of cards (Quests) |
| faction | <code>string</code> | faction (Sp[ecial abilities or perks) |
| class | <code>string</code> | class (Special abilities or perks) |
| holds | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | the resources belonging to this player |
| color | <code>string</code> | color representation of player |


* [.Player](#AnyBoard.Player)
  * [new AnyBoard.Player(name, [options])](#new_AnyBoard.Player_new)
  * _instance_
    * [.pay(resources, [receivingPlayer])](#AnyBoard.Player+pay) ⇒ <code>boolean</code>
    * [.trade(giveResources, receiveResources, [player])](#AnyBoard.Player+trade) ⇒ <code>boolean</code>
    * [.recieve(resourceSet)](#AnyBoard.Player+recieve)
    * [.draw(deck, [options])](#AnyBoard.Player+draw) ⇒ <code>[Card](#AnyBoard.Card)</code>
    * [.play(card, [customOptions])](#AnyBoard.Player+play) ⇒ <code>boolean</code>
    * [.toString()](#AnyBoard.Player+toString) ⇒ <code>string</code>
  * _static_
    * [.get(name)](#AnyBoard.Player.get) ⇒ <code>[Player](#AnyBoard.Player)</code>

<a name="new_AnyBoard.Player_new"></a>
#### new AnyBoard.Player(name, [options])
Represents a Player (AnyBoard.Player)


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the player |
| [options] | <code>object</code> | *(optional)* options for the player |
| [options.color] | <code>string</code> | *(optional)* color representing the player |
| [options.faction] | <code>string</code> | *(optional)* faction representing the player |
| [options.class] | <code>string</code> | *(optional)* class representing the player |
| [options.yourAttributeHere] | <code>any</code> | *(optional)* custom attributes, as well as specified ones, are all placed in player.properties. E.g. 'age' would be placed in player.properties.age. |

<a name="AnyBoard.Player+pay"></a>
#### player.pay(resources, [receivingPlayer]) ⇒ <code>boolean</code>
Take resources from this player and give to receivingPlayer.

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>boolean</code> - whether or not transaction was completed (false if Player don't hold enough resources)  

| Param | Type | Description |
| --- | --- | --- |
| resources | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | dictionary of resources |
| [receivingPlayer] | <code>[Player](#AnyBoard.Player)</code> | *(optional)* Who shall receive the resources. Omit if not to anyone (e.g. give to "the bank") |

<a name="AnyBoard.Player+trade"></a>
#### player.trade(giveResources, receiveResources, [player]) ⇒ <code>boolean</code>
Trade resources between players/game

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>boolean</code> - whether or not transaction was completed (false if Player don't hold enough resources)  

| Param | Type | Description |
| --- | --- | --- |
| giveResources | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | resources this player shall give |
| receiveResources | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | resources this player receieves |
| [player] | <code>[Player](#AnyBoard.Player)</code> | *(optional)* Who shall be traded with. Omit if not to a player, but to "the bank". |

**Example**  
```js
new AnyBoard.Resource("gold");
new AnyBoard.Resource("silver");

var startTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
var goldTreasure = new AnyBoard.ResourceSet({"gold": 2});
var silverTreasure = new AnyBoard.ResourceSet({"silver": 12});

var dr1 = new AnyBoard.Player("firstDoctor");
var dr2 = new AnyBoard.Player("secondDoctor");

dr1.receive(startTreasure);
dr2.receive(startTreasure);

// returns true. dr1 will now own {"gold": 4, "silver": 54}. dr2 owns {"gold": 8, "silver": 30}
dr1.trade(goldTreasure, silverTreasure, dr2)
```
**Example**  
```js
// returns true. dr1 will now own {"gold": 2, "silver": 66}. dr2 still owns {"gold": 8, "silver": 30}
dr1.trade(goldTreasure, silverTreasure)
```
**Example**  
```js
var firstOverlappingTreasure = new AnyBoard.ResourceSet({"silver": 115, "gold": "6"});
var secondOverlappingTreasure= new AnyBoard.ResourceSet({"silver": 100, "gold": "7"});

// returns true. The trade nullifies the similarities, so that the trade can go through even though
//     dr1 has < 100 silver
dr1.trade(firstOverlappingTreasure, secondOverlappingTreasure)
```
<a name="AnyBoard.Player+recieve"></a>
#### player.recieve(resourceSet)
Receive resource from bank/game. Use pay() when receiving from players.

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | resources to be added to this players bank |

**Example**  
```js
new AnyBoard.Resource("gold");
new AnyBoard.Resource("silver");

var startTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
var secondTresure = new AnyBoard.ResourceSet({"silver": 12, "copper": 122});

var dr1 = new AnyBoard.Player("firstDoctor");  // player owns nothing initially

dr1.receive(startTreasure);  // owns {"gold": 6, "silver": 42}
dr1.receive(secondTresure);  // owns {"gold": 6, "silver": 54, "copper": 122}
```
<a name="AnyBoard.Player+draw"></a>
#### player.draw(deck, [options]) ⇒ <code>[Card](#AnyBoard.Card)</code>
Draws a card from a deck and puts it in the hand of the player

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>[Card](#AnyBoard.Card)</code> - card that is drawn  

| Param | Type | Description |
| --- | --- | --- |
| deck | <code>[Deck](#AnyBoard.Deck)</code> | deck to be drawn from |
| [options] | <code>object</code> | *(optional)* parameters to be sent to the drawListeners on the deck |

**Example**  
```js
var dr1 = new AnyBoard.Player("firstDoctor");  // player has no cards initially

// Now has one card
dr1.draw(deck);

// Now has two cards. option parameter is being passed on to any drawListeners (See Deck/Card)
dr1.draw(deck, options);
```
<a name="AnyBoard.Player+play"></a>
#### player.play(card, [customOptions]) ⇒ <code>boolean</code>
Plays a card from the hand. If the hand does not contain the card, the card is not played and the hand unchanged.

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>boolean</code> - whether or not the card was played  

| Param | Type | Description |
| --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> | card to be played |
| [customOptions] | <code>object</code> | *(optional)* custom options that the play should be played with |

**Example**  
```js
var DrWho = new AnyBoard.Player("firstDoctor");  // player has no cards initially

// Store the card that was drawn
var card = DrWho.draw(existingDeck);

// Play that same card
DrWho.play(card)
```
<a name="AnyBoard.Player+toString"></a>
#### player.toString() ⇒ <code>string</code>
Returns a string representation of the player

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
<a name="AnyBoard.Player.get"></a>
#### Player.get(name) ⇒ <code>[Player](#AnyBoard.Player)</code>
Returns player with given name

**Kind**: static method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>[Player](#AnyBoard.Player)</code> - player with given name (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of player |

<a name="AnyBoard.Hand"></a>
### AnyBoard.Hand
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  

* [.Hand](#AnyBoard.Hand)
  * [new AnyBoard.Hand(player, [options])](#new_AnyBoard.Hand_new)
  * [.has(card, [amount])](#AnyBoard.Hand+has) ⇒ <code>boolean</code>
  * [.discardHand()](#AnyBoard.Hand+discardHand)
  * [.discardCard(card)](#AnyBoard.Hand+discardCard)
  * [.toString()](#AnyBoard.Hand+toString) ⇒ <code>string</code>

<a name="new_AnyBoard.Hand_new"></a>
#### new AnyBoard.Hand(player, [options])
Represents a Hand of a player, containing cards. Players are given one Hand in Person constructor.


| Param | Type | Description |
| --- | --- | --- |
| player | <code>[Player](#AnyBoard.Player)</code> | player to which this hand belongs |
| [options] | <code>object</code> | *(optional)* custom properties added to this hand |

<a name="AnyBoard.Hand+has"></a>
#### hand.has(card, [amount]) ⇒ <code>boolean</code>
Checks whether or not a player has an amount card in this hand.

**Kind**: instance method of <code>[Hand](#AnyBoard.Hand)</code>  
**Returns**: <code>boolean</code> - hasCard whether or not the player has that amount or more of that card in this hand  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> |  | card to be checked if is in hand |
| [amount] | <code>number</code> | <code>1</code> | amount of card to be checked if is in hand |

**Example**  
```js
var DrWho = new AnyBoard.Player("firstDoctor");  // player has no cards initially

// Store the card that was drawn
var tardis = DrWho.draw(tardisDeck);

// returns true
DrWho.hand.has(card)

// returns false, as he has only one
DrWho.hand.has(card, 3)
```
<a name="AnyBoard.Hand+discardHand"></a>
#### hand.discardHand()
Discard the entire hand of the player, leaving him with no cards

**Kind**: instance method of <code>[Hand](#AnyBoard.Hand)</code>  
<a name="AnyBoard.Hand+discardCard"></a>
#### hand.discardCard(card)
Discard a card from the hand of the player

**Kind**: instance method of <code>[Hand](#AnyBoard.Hand)</code>  

| Param | Type | Description |
| --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> | card to be discarded. |

<a name="AnyBoard.Hand+toString"></a>
#### hand.toString() ⇒ <code>string</code>
Returns a string representation of the hand

**Kind**: instance method of <code>[Hand](#AnyBoard.Hand)</code>  
<a name="AnyBoard.Resource"></a>
### AnyBoard.Resource
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of resource |
| properties | <code>any</code> | custom options added to resource |


* [.Resource](#AnyBoard.Resource)
  * [new AnyBoard.Resource(name, [properties])](#new_AnyBoard.Resource_new)
  * [.get(name)](#AnyBoard.Resource.get) ⇒ <code>[Resource](#AnyBoard.Resource)</code>

<a name="new_AnyBoard.Resource_new"></a>
#### new AnyBoard.Resource(name, [properties])
Represents a simple resource (AnyBoard.Resource)


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name representing the resource |
| [properties] | <code>object</code> | *(optional)* custom properties of this resource |

**Example**  
```js
var simpleGold = new AnyBoard.Resource("gold");

// The optional properties parameter can be of any type.
var advancedPowder = new AnyBoard.Resource("powder", {"value": 6, "color": "blue"});

// 6
advancedPowder.properties.value
```
<a name="AnyBoard.Resource.get"></a>
#### Resource.get(name) ⇒ <code>[Resource](#AnyBoard.Resource)</code>
Returns resource with given name

**Kind**: static method of <code>[Resource](#AnyBoard.Resource)</code>  
**Returns**: <code>[Resource](#AnyBoard.Resource)</code> - resource with given name (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of resource |

**Example**  
```js
var simpleGold = new AnyBoard.Resource("gold");

// returns simpleGold
AnyBoard.Resource.get("gold");
```
<a name="AnyBoard.ResourceSet"></a>
### AnyBoard.ResourceSet
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| resources | <code>object</code> |  | *(optional)* a set of initially contained resources |
| allowNegative | <code>boolean</code> | <code>false</code> | whether or not to allow being subtracted resources to below 0 (dept) |


* [.ResourceSet](#AnyBoard.ResourceSet)
  * [new AnyBoard.ResourceSet([resources], [allowNegative])](#new_AnyBoard.ResourceSet_new)
  * [.contains(reqResource)](#AnyBoard.ResourceSet+contains) ⇒ <code>boolean</code>
  * [.add(resourceSet)](#AnyBoard.ResourceSet+add)
  * [.subtract(resourceSet)](#AnyBoard.ResourceSet+subtract) ⇒ <code>boolean</code>
  * [.similarities(resourceSet)](#AnyBoard.ResourceSet+similarities) ⇒ <code>object</code>

<a name="new_AnyBoard.ResourceSet_new"></a>
#### new AnyBoard.ResourceSet([resources], [allowNegative])
Creates a ResourceSet


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [resources] | <code>object</code> |  | *(optional)* a set of initially contained resources |
| [allowNegative] | <code>boolean</code> | <code>false</code> | whether or not to allow being subtracted resources to below 0 (dept) |

**Example**  
```js
// Returns a resourceset that can be deducted below 0
var debtBank = new AnyBoard.ResourceSet({}, true);
```
<a name="AnyBoard.ResourceSet+contains"></a>
#### resourceSet.contains(reqResource) ⇒ <code>boolean</code>
Whether or not a ResourceSet contains another ResourceSet

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  
**Returns**: <code>boolean</code> - true if this ResourceSet contains reqResource, else false  

| Param | Type | Description |
| --- | --- | --- |
| reqResource | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | ResourceSet to be compared against |

**Example**  
```js
new AnyBoard.Resource("gold");
new AnyBoard.Resource("silver");

var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
var minorDebt = new AnyBoard.ResourceSet({"gold": 1, "silver": 3});
var hugeDebt = new AnyBoard.ResourceSet({"gold": 12, "silver": 41});

// returns true
myTreasure.contains(minorDebt);

// returns false
myTreasure.contains(hugeDebt);
```
<a name="AnyBoard.ResourceSet+add"></a>
#### resourceSet.add(resourceSet)
Adds a ResourceSet to this one

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | ResourceSet to be added to this one |

**Example**  
```js
new AnyBoard.Resource("gold");
new AnyBoard.Resource("silver");

var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
var minorGift = new AnyBoard.ResourceSet({"silver": 2});

myTreasure.add(minorGift);
// myTreasure is now {"gold": 6, "silver": 45}
```
<a name="AnyBoard.ResourceSet+subtract"></a>
#### resourceSet.subtract(resourceSet) ⇒ <code>boolean</code>
Subtracts a dictionary of resources and amounts to a ResourceSet

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  
**Returns**: <code>boolean</code> - whether or not resources were subtracted successfully  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | set of resources to be subtracted |

**Example**  
```js
new AnyBoard.Resource("gold");
new AnyBoard.Resource("silver");

var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
var minorGift = new AnyBoard.ResourceSet({"silver": 2});
var debtBank = new AnyBoard.ResourceSet({}, true);
var cosyBank = new AnyBoard.ResourceSet();

// returns true. myTreasure becomes {"gold": 6, "silver": 40}
myTreasure.subtract(minorGift);

// returns true. debtbank becomes {"silver": -2}
debtBank.subtract(minorGift);

// returns false and leaves cosyBank unchanged
cosyBank.subtract(minorGift);
```
<a name="AnyBoard.ResourceSet+similarities"></a>
#### resourceSet.similarities(resourceSet) ⇒ <code>object</code>
Returns the common resources and minimum amount between a dictionary of resources and amounts, and this ResourceSet

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  
**Returns**: <code>object</code> - similarities dictionary of common resources and amounts  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | dictionary of resources and amounts to be compared against |

**Example**  
```js
new AnyBoard.Resource("gold");
new AnyBoard.Resource("silver");

var myTreasure = new AnyBoard.ResourceSet({"gold": 6, "silver": 42});
var otherTresure = new AnyBoard.ResourceSet({"silver": 2, "bacon": 12});

// returns {"silver": 2}
myTreasure.similarities(otherTresure);
```
<a name="AnyBoard.BaseToken"></a>
### AnyBoard.BaseToken
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the token |
| address | <code>string</code> | address of the token found when scanned |
| connected | <code>boolean</code> | whether or not the token is connected |
| device | <code>object</code> | driver spesific data. |
| listeners | <code>object</code> | functions to be executed upon certain triggered events |
| sendQueue | <code>Array.&lt;function()&gt;</code> | queue for communicating with |
| cache | <code>object</code> | key-value store for caching certain communication calls |
| driver | <code>[Driver](#AnyBoard.Driver)</code> | driver that handles communication |


* [.BaseToken](#AnyBoard.BaseToken)
  * [new AnyBoard.BaseToken(name, address, device, [driver])](#new_AnyBoard.BaseToken_new)
  * _instance_
    * [.isConnected()](#AnyBoard.BaseToken+isConnected) ⇒ <code>boolean</code>
    * [.connect([win], [fail])](#AnyBoard.BaseToken+connect)
    * [.disconnect()](#AnyBoard.BaseToken+disconnect)
    * [.trigger(eventName, [eventOptions])](#AnyBoard.BaseToken+trigger)
    * [.on(eventName, callbackFunction)](#AnyBoard.BaseToken+on)
    * [.once(eventName, callbackFunction)](#AnyBoard.BaseToken+once)
    * [.send(data, [win], [fail])](#AnyBoard.BaseToken+send)
    * [.print(value, [win], [fail])](#AnyBoard.BaseToken+print)
    * [.getFirmwareName([win], [fail])](#AnyBoard.BaseToken+getFirmwareName)
    * [.getFirmwareVersion([win], [fail])](#AnyBoard.BaseToken+getFirmwareVersion)
    * [.getFirmwareUUID([win], [fail])](#AnyBoard.BaseToken+getFirmwareUUID)
    * [.hasLed([win], [fail])](#AnyBoard.BaseToken+hasLed)
    * [.hasLedColor([win], [fail])](#AnyBoard.BaseToken+hasLedColor)
    * [.hasVibration([win], [fail])](#AnyBoard.BaseToken+hasVibration)
    * [.hasColorDetection([win], [fail])](#AnyBoard.BaseToken+hasColorDetection)
    * [.hasLedScreen([win], [fail])](#AnyBoard.BaseToken+hasLedScreen)
    * [.hasRfid([win], [fail])](#AnyBoard.BaseToken+hasRfid)
    * [.hasNfc([win], [fail])](#AnyBoard.BaseToken+hasNfc)
    * [.hasAccelometer([win], [fail])](#AnyBoard.BaseToken+hasAccelometer)
    * [.hasTemperature([win], [fail])](#AnyBoard.BaseToken+hasTemperature)
    * [.ledOn(value, [win], [fail])](#AnyBoard.BaseToken+ledOn)
    * [.ledBlink(value, [win], [fail])](#AnyBoard.BaseToken+ledBlink)
    * [.ledOff([win], [fail])](#AnyBoard.BaseToken+ledOff)
    * [.toString()](#AnyBoard.BaseToken+toString) ⇒ <code>string</code>
  * _static_
    * [.setDefaultDriver(driver)](#AnyBoard.BaseToken.setDefaultDriver) ⇒ <code>boolean</code>

<a name="new_AnyBoard.BaseToken_new"></a>
#### new AnyBoard.BaseToken(name, address, device, [driver])
Base class for tokens. Should be used by communication driver upon AnyBoard.TokenManager.scan()


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | name of the token |
| address | <code>string</code> |  | address of the token found when scanned |
| device | <code>object</code> |  | device object used and handled by driver |
| [driver] | <code>[Driver](#AnyBoard.Driver)</code> | <code>AnyBoard.BaseToken._defaultDriver</code> | token driver for handling communication with it. |

<a name="AnyBoard.BaseToken+isConnected"></a>
#### baseToken.isConnected() ⇒ <code>boolean</code>
Returns whether or not the token is connected

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  
**Returns**: <code>boolean</code> - true if connected, else false  
<a name="AnyBoard.BaseToken+connect"></a>
#### baseToken.connect([win], [fail])
Attempts to connect to token. Uses TokenManager driver, not its own, since connect
     needs to happen before determining suitable driver.

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdNoParamCallback](#stdNoParamCallback)</code> | *(optional)* function to be executed upon success |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* function to be executed upon failure |

<a name="AnyBoard.BaseToken+disconnect"></a>
#### baseToken.disconnect()
Disconnects from the token.

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  
<a name="AnyBoard.BaseToken+trigger"></a>
#### baseToken.trigger(eventName, [eventOptions])
Trigger an event on a token. Also used to trigger special events (Token, Token-Token and Token-Eonstraint-events) by
specifying 'meta-eventType' = 'token', 'token-token' or 'token-constraint' in eventOptions.

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event |
| [eventOptions] | <code>object</code> | (*optional)* dictionary of parameters and values |

**Example**  
```js
var onTimeTravelCallback = function (options) {console.log("The tardis is great!")};
existingToken.on('timeTravelled', onTimeTravelCallback);

// Triggers the function, and prints praise for the tardis
existingToken.trigger('timeTravelled');

existingToken.trigger('timeTravelled');  // prints again
existingToken.trigger('timeTravelled');  // prints again
```
<a name="AnyBoard.BaseToken+on"></a>
#### baseToken.on(eventName, callbackFunction)
Adds a callbackFunction to be executed always when event is triggered

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[simpleEventCallback](#simpleEventCallback)</code> | function to be executed |

**Example**  
```js
var onTimeTravelCallback = function () {console.log("The tardis is great!")};
existingToken.on('timeTravelled', onTimeTravelCallback);

// Triggers the function, and prints praise for the tardis
existingToken.trigger('timeTravelled');

existingToken.trigger('timeTravelled');  // prints again
existingToken.trigger('timeTravelled');  // prints again
```
**Example**  
```js
var onTimeTravelCallback = function (options) {
    // Options can be left out of a trigger. You should therefore check
    // that input is as expected, throw an error or give a default value
    var name = (options && options.name ? options.name : "You're");

    console.log(options.name + " is great!");
};
existingToken.on('timeTravelled', onTimeTravelCallback);

// prints "Dr.Who is great!"
existingToken.trigger('timeTravelled', {"name": "Dr.Who"});

// prints "You're great!"
existingToken.trigger('timeTravelled');
```
<a name="AnyBoard.BaseToken+once"></a>
#### baseToken.once(eventName, callbackFunction)
Adds a callbackFunction to be executed next time an event is triggered

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[simpleEventCallback](#simpleEventCallback)</code> | function to be executed |

**Example**  
```js
var onTimeTravelCallback = function (options) {console.log("The tardis is great!")};
existingToken.once('timeTravelled', onTimeTravelCallback);

// Triggers the function, and prints praise for the tardis
existingToken.trigger('timeTravelled');

// No effect
existingToken.trigger('timeTravelled');
```
<a name="AnyBoard.BaseToken+send"></a>
#### baseToken.send(data, [win], [fail])
Sends data to the token. Uses either own driver, or (if not set) TokenManager driver

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Uint8Array</code> &#124; <code>ArrayBuffer</code> &#124; <code>String</code> | data to be sent |
| [win] | <code>[stdNoParamCallback](#stdNoParamCallback)</code> | *(optional)* function to be executed upon success |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* function to be executed upon error |

<a name="AnyBoard.BaseToken+print"></a>
#### baseToken.print(value, [win], [fail])
Prints to Token

String can have special tokens to signify some printer command, e.g. ##n = newLine.
Refer to the individual driver for token spesific implementation and capabilites

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> |  |
| [win] | <code>[stdNoParamCallback](#stdNoParamCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+getFirmwareName"></a>
#### baseToken.getFirmwareName([win], [fail])
Gets the name of the firmware type of the token

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdStringCallback](#stdStringCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

**Example**  
```js
// Function to be executed upon name retrieval
var getNameCallback = function (name) {console.log("Firmware name: " + name)};

// Function to be executed upon failure to retrieve name
var failGettingNameCallback = function (name) {console.log("Couldn't get name :(")};

existingToken.getFirmwareName(getNameCallback, failGettingNameCallback);

// Since it's asyncronous, this will be printed before the result
console.log("This comes first!")
```
<a name="AnyBoard.BaseToken+getFirmwareVersion"></a>
#### baseToken.getFirmwareVersion([win], [fail])
Gets the version of the firmware type of the token

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdStringCallback](#stdStringCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+getFirmwareUUID"></a>
#### baseToken.getFirmwareUUID([win], [fail])
Gets a uniquie ID the firmware of the token

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdStringCallback](#stdStringCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasLed"></a>
#### baseToken.hasLed([win], [fail])
Checks whether or not the token has simple LED

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasLedColor"></a>
#### baseToken.hasLedColor([win], [fail])
Checks whether or not the token has colored LEDs

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasVibration"></a>
#### baseToken.hasVibration([win], [fail])
Checks whether or not the token has vibration

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasColorDetection"></a>
#### baseToken.hasColorDetection([win], [fail])
Checks whether or not the token has ColorDetection

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasLedScreen"></a>
#### baseToken.hasLedScreen([win], [fail])
Checks whether or not the token has LedSceen

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasRfid"></a>
#### baseToken.hasRfid([win], [fail])
Checks whether or not the token has RFID reader

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasNfc"></a>
#### baseToken.hasNfc([win], [fail])
Checks whether or not the token has NFC reader

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasAccelometer"></a>
#### baseToken.hasAccelometer([win], [fail])
Checks whether or not the token has Accelometer

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+hasTemperature"></a>
#### baseToken.hasTemperature([win], [fail])
Checks whether or not the token has temperature measurement

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdBoolCallback](#stdBoolCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon failure |

<a name="AnyBoard.BaseToken+ledOn"></a>
#### baseToken.ledOn(value, [win], [fail])
Sets color on token

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> &#124; <code>Array</code> | string with color name or array of [red, green, blue] values 0-255 |
| [win] | <code>[stdNoParamCallback](#stdNoParamCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon |

**Example**  
```js
// sets Led to white
existingToken.ledOn([255, 255, 255]);

// sets Led to white (See driver implementation for what colors are supported)
existingToken.ledOn("white");
```
<a name="AnyBoard.BaseToken+ledBlink"></a>
#### baseToken.ledBlink(value, [win], [fail])
tells token to blink its led

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> &#124; <code>Array</code> | string with color name or array of [red, green, blue] values 0-255 |
| [win] | <code>[stdNoParamCallback](#stdNoParamCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon |

**Example**  
```js
// blinks red
existingToken.ledBlink([255, 0, 0]);

// blinks blue
existingToken.ledBlink("blue");
```
<a name="AnyBoard.BaseToken+ledOff"></a>
#### baseToken.ledOff([win], [fail])
Turns LED off

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[stdNoParamCallback](#stdNoParamCallback)</code> | *(optional)* callback function to be called upon successful execution |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* callback function to be executed upon |

<a name="AnyBoard.BaseToken+toString"></a>
#### baseToken.toString() ⇒ <code>string</code>
Representational string of class instance.

**Kind**: instance method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  
<a name="AnyBoard.BaseToken.setDefaultDriver"></a>
#### BaseToken.setDefaultDriver(driver) ⇒ <code>boolean</code>
Sets a new default driver to handle communication for tokens without specified driver.
The driver must have implement a method *send(win, fail)* in order to discover tokens.

**Kind**: static method of <code>[BaseToken](#AnyBoard.BaseToken)</code>  
**Returns**: <code>boolean</code> - whether or not driver was successfully set  

| Param | Type | Description |
| --- | --- | --- |
| driver | <code>[Driver](#AnyBoard.Driver)</code> | driver to be used for communication |

<a name="AnyBoard.Drivers"></a>
### AnyBoard.Drivers : <code>Object</code>
Manager of drivers.

**Kind**: static property of <code>[AnyBoard](#AnyBoard)</code>  

* [.Drivers](#AnyBoard.Drivers) : <code>Object</code>
  * [.get(name)](#AnyBoard.Drivers.get) ⇒ <code>[Driver](#AnyBoard.Driver)</code> &#124; <code>undefined</code>
  * [.getCompatibleDriver(type, compatibility)](#AnyBoard.Drivers.getCompatibleDriver) ⇒ <code>[Driver](#AnyBoard.Driver)</code>

<a name="AnyBoard.Drivers.get"></a>
#### Drivers.get(name) ⇒ <code>[Driver](#AnyBoard.Driver)</code> &#124; <code>undefined</code>
Returns driver with given name

**Kind**: static method of <code>[Drivers](#AnyBoard.Drivers)</code>  
**Returns**: <code>[Driver](#AnyBoard.Driver)</code> &#124; <code>undefined</code> - driver with given name (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of driver |

**Example**  
```js
var discoveryBluetooth = new AnyBoard.Driver({
        name: 'theTardisMachine',
        description: 'bla bla',
        version: '1.0',
        type: ['bluetooth-discovery', 'bluetooth'],
        compatibility: ['tardis', 'pancakes']
    });

// Returns undefined
AnyBoard.Drivers.get("non-existant-driver")

// Returns driver
AnyBoard.Drivers.get("theTardisMachine")
```
<a name="AnyBoard.Drivers.getCompatibleDriver"></a>
#### Drivers.getCompatibleDriver(type, compatibility) ⇒ <code>[Driver](#AnyBoard.Driver)</code>
Returns first driver of certain type that matches the given compatibility.

**Kind**: static method of <code>[Drivers](#AnyBoard.Drivers)</code>  
**Returns**: <code>[Driver](#AnyBoard.Driver)</code> - compatible driver (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | name of driver |
| compatibility | <code>string</code> &#124; <code>object</code> | name of driver |

**Example**  
```js
var discoveryBluetooth = new AnyBoard.Driver({
        name: 'theTardisMachine',
        description: 'bla bla',
        version: '1.0',
        type: ['bluetooth-discovery', 'bluetooth'],
        compatibility: ['tardis', {"show": "Doctor Who"}]
    });

// Returns undefined (right type, wrong compatibility)
AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'weirdCompatibility');

// Returns undefined (wrong type, right compatibility)
AnyBoard.Drivers.getCompatibleDriver('HTTP, {"service": "iCanTypeAnyThingHere"});

// Returns discoveryBluetooth driver
AnyBoard.Drivers.getCompatibleDriver('bluetooth', 'tardis');
```
<a name="AnyBoard.TokenManager"></a>
### AnyBoard.TokenManager
A token manager. Holds all tokens. Discovers and connects to them.

**Kind**: static property of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| tokens | <code>object</code> | dictionary of connect tokens that maps id to object |
| driver | <code>[Driver](#AnyBoard.Driver)</code> | driver for communication with tokens. Set with setDriver(driver); |


* [.TokenManager](#AnyBoard.TokenManager)
  * [.setDriver(driver)](#AnyBoard.TokenManager.setDriver)
  * [.scan([win], [fail], [timeout])](#AnyBoard.TokenManager.scan)
  * [.get(address)](#AnyBoard.TokenManager.get) ⇒ <code>[BaseToken](#AnyBoard.BaseToken)</code>
  * [.onTokenTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onTokenTokenEvent)
  * [.onceTokenTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onceTokenTokenEvent)
  * [.onTokenConstraintEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onTokenConstraintEvent)
  * [.onceTokenConstraintEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onceTokenConstraintEvent)
  * [.onTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onTokenEvent)
  * [.onceTokenEvent(eventName, callbackFunction)](#AnyBoard.TokenManager.onceTokenEvent)

<a name="AnyBoard.TokenManager.setDriver"></a>
#### TokenManager.setDriver(driver)
Sets a new default driver to handle communication for tokens without specified driver.
The driver must have implemented methods *scan(win, fail, timeout) connect(token, win, fail) and
disconnect(token, win, fail)*, in order to discover tokens.

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| driver | <code>[Driver](#AnyBoard.Driver)</code> | driver to be used for communication |

<a name="AnyBoard.TokenManager.scan"></a>
#### TokenManager.scan([win], [fail], [timeout])
Scans for tokens nearby and stores in discoveredTokens property

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| [win] | <code>[onScanCallback](#onScanCallback)</code> | *(optional)* function to be executed when devices are found (called for each device found) |
| [fail] | <code>[stdErrorCallback](#stdErrorCallback)</code> | *(optional)* function to be executed upon failure |
| [timeout] | <code>number</code> | *(optional)* amount of milliseconds to scan before stopping. Driver has a default. |

**Example**  
```js
var onDiscover = function(token) { console.log("I found " + token) };

// Scans for tokens. For every token found, it prints "I found ...")
TokenManager.scan(onDiscover);
```
<a name="AnyBoard.TokenManager.get"></a>
#### TokenManager.get(address) ⇒ <code>[BaseToken](#AnyBoard.BaseToken)</code>
Returns a token handled by this TokenManager

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  
**Returns**: <code>[BaseToken](#AnyBoard.BaseToken)</code> - token if handled by this tokenManager, else undefined  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | identifer of the token found when scanned |

<a name="AnyBoard.TokenManager.onTokenTokenEvent"></a>
#### TokenManager.onTokenTokenEvent(eventName, callbackFunction)
Adds a callbackFunction to be executed always when a token-token event is triggered

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[tokenTokenEventCallback](#tokenTokenEventCallback)</code> | function to be executed |

**Example**  
```js
var cb = function (initToken, resToken, event, options) {
     console.log(initToken + " " + event + " " + resToken);
};

TokenManager.onTokenTokenEvent("MOVE_NEXT_TO", cb);

// prints "existingToken MOVE_NEXT_TO anotherToken";
existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token", "token": anotherToken};

// prints "existingToken MOVE_NEXT_TO oldToken";
existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token", "token": anotherToken};
```
<a name="AnyBoard.TokenManager.onceTokenTokenEvent"></a>
#### TokenManager.onceTokenTokenEvent(eventName, callbackFunction)
Adds a callbackFunction to be executed next time a token-token event is triggered

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[tokenTokenEventCallback](#tokenTokenEventCallback)</code> | function to be executed |

**Example**  
```js
var cb = function (initToken, resToken, event, options) {
     console.log(initToken + " " + event + " " + resToken);
};

TokenManager.onceTokenTokenEvent("MOVE_NEXT_TO", cb);

// prints "existingToken MOVE_NEXT_TO anotherToken";
existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token-token", "token": anotherToken};

// no effect
existingToken.trigger("MOVE_NEXT_TO", {"meta-eventType": "token-token", "token": anotherToken};
```
<a name="AnyBoard.TokenManager.onTokenConstraintEvent"></a>
#### TokenManager.onTokenConstraintEvent(eventName, callbackFunction)
Adds a callbackFunction to be executed always when a token-constraint event is triggered.
A token-constraint event is a physical token interaction with a game constraint, e.g. moving a pawn within a board.

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[tokenConstraintEventCallback](#tokenConstraintEventCallback)</code> | function to be executed |

**Example**  
```js
var cb = function (initToken, constraint, event, options) {
     console.log(initToken + " " + event + " " + constraint);
};

TokenManager.onTokenConstraintEvent("MOVE", cb);

// prints "existingToken MOVE Tile-5";
existingToken.trigger("MOVE", {"meta-eventType": "token-constraint", "constraint": "Tile-5"};

// prints "existingToken MOVE Tile-5";
existingToken.trigger("MOVE", {"meta-eventType": "token-constraint", "constraint": "Tile-5"};
```
<a name="AnyBoard.TokenManager.onceTokenConstraintEvent"></a>
#### TokenManager.onceTokenConstraintEvent(eventName, callbackFunction)
Adds a callbackFunction to be executed next time a token-constraint event is triggered

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[tokenConstraintEventCallback](#tokenConstraintEventCallback)</code> | function to be executed |

**Example**  
```js
var cb = function (initToken, constraint, event, options) {
     console.log(initToken + " " + event + " " + constraint);
};

TokenManager.onceTokenConstraintEvent("MOVE", cb);

// prints "existingToken MOVE Tile-5";
existingToken.trigger("MOVE", {"meta-eventType": "token-constraint"", "constraint": "Tile-5"};

// no effect
existingToken.trigger("MOVE", {"meta-eventType": "token-constraint""};
```
<a name="AnyBoard.TokenManager.onTokenEvent"></a>
#### TokenManager.onTokenEvent(eventName, callbackFunction)
Adds a callbackFunction to be executed always when a token event is triggered.
A token event is an physical interaction with a single token.

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[tokenEventCallback](#tokenEventCallback)</code> | function to be executed |

**Example**  
```js
var cb = function (initToken, event, options) {
     console.log(initToken + " was " + event + "'ed ");
};

TokenManager.onTokenEvent("LIFT", cb);

// prints "existingToken was LIFT'ed"
existingToken.trigger("LIFT", {"meta-eventType": "token"};

// prints "existingToken was LIFT'ed"
existingToken.trigger("LIFT", {"meta-eventType": "token"};
```
<a name="AnyBoard.TokenManager.onceTokenEvent"></a>
#### TokenManager.onceTokenEvent(eventName, callbackFunction)
Adds a callbackFunction to be executed next time a token event is triggered

**Kind**: static method of <code>[TokenManager](#AnyBoard.TokenManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| eventName | <code>string</code> | name of event to listen to |
| callbackFunction | <code>[tokenEventCallback](#tokenEventCallback)</code> | function to be executed |

**Example**  
```js
var cb = function (initToken, event, options) {
     console.log(initToken + " was " + event + "'ed ");
};

TokenManager.onceTokenEvent("LIFT", cb);

// prints "existingToken was LIFT'ed"
existingToken.trigger("LIFT", {"meta-eventType": "token"};

// No effect
existingToken.trigger('LIFT');
```
<a name="AnyBoard.Logger"></a>
### AnyBoard.Logger
Static logger object that handles logging. Will log using hyper.log if hyper is present (when using Evothings).
Will then log all events, regardless of severity

**Kind**: static property of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| threshold | <code>number</code> | *(default: 10)* threshold on whether or not to log an event.      Any message with level above or equal threshold will be logged |
| debugLevel | <code>number</code> | *(value: 0)* sets a threshold for when a log should be considered a debug log event. |
| normalLevel | <code>number</code> | *(value: 10)* sets a threshold for when a log should be considered a normal log event. |
| warningLevel | <code>number</code> | *(value: 20)* sets a threshold for when a log should be considered a warning. |
| errorLevel | <code>number</code> | *(value: 30)* sets a threshold for when a log should be considered a fatal error. |
| loggerObject | <code>object</code> | *(default: console)* logging method. Must have implemented .debug(), .log(), .warn() and .error() |


* [.Logger](#AnyBoard.Logger)
  * [.warn(message, [sender])](#AnyBoard.Logger.warn)
  * [.error(message, [sender])](#AnyBoard.Logger.error)
  * [.log(message, [sender])](#AnyBoard.Logger.log)
  * [.debug(message, [sender])](#AnyBoard.Logger.debug)
  * [.setThreshold(severity)](#AnyBoard.Logger.setThreshold)

<a name="AnyBoard.Logger.warn"></a>
#### Logger.warn(message, [sender])
logs a warning. Ignored if threshold > this.warningLevel (default: 20)

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| [sender] | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.error"></a>
#### Logger.error(message, [sender])
logs an error. Will never be ignored.

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| [sender] | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.log"></a>
#### Logger.log(message, [sender])
logs a normal event. Ignored if threshold > this.normalLevel (default: 10)

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| [sender] | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.debug"></a>
#### Logger.debug(message, [sender])
logs debugging information. Ignored if threshold > this.debugLevel (default: 0)

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| [sender] | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.setThreshold"></a>
#### Logger.setThreshold(severity)
Sets threshold for logging

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| severity | <code>number</code> | a message has to have before being logged |

**Example**  
```js
// By default, debug doesn't log
AnyBoard.debug("Hi")  // does not log
```
**Example**  
```js
// But you can lower the thresholdlevel
AnyBoard.Logger.setThreshold(AnyBoard.Logger.debugLevel)
AnyBoard.debug("I'm here afterall!")  // logs
```
**Example**  
```js
// Or increase it to avoid certain logging
AnyBoard.Logger.setThreshold(AnyBoard.Logger.errorLevel)
AnyBoard.warn("The tardis has arrived!")  // does not log
```
**Example**  
```js
// But you can never avoid errors
AnyBoard.Logger.setThreshold(AnyBoard.Logger.errorLevel+1)
AnyBoard.error("The Doctor is dead!!")  // logs
```
<a name="AnyBoard.Utils"></a>
### AnyBoard.Utils
Utility functions for AnyBoard

**Kind**: static property of <code>[AnyBoard](#AnyBoard)</code>  
<a name="AnyBoard.Utils.isEqual"></a>
#### Utils.isEqual(a, b, [aStack], [bStack]) ⇒ <code>boolean</code>
Returns whether or not two objects are equal. Works with objects, dictionaries, and arrays as well.

**Kind**: static method of <code>[Utils](#AnyBoard.Utils)</code>  
**Returns**: <code>boolean</code> - whether or not the items were equal  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>object</code> &#124; <code>Array</code> &#124; <code>String</code> &#124; <code>number</code> &#124; <code>boolean</code> | item to compare |
| b | <code>object</code> &#124; <code>Array</code> &#124; <code>String</code> &#124; <code>number</code> &#124; <code>boolean</code> | item to compare against a |
| [aStack] | <code>Array</code> | *(optional)* array of items to further compare |
| [bStack] | <code>Array</code> | *(optional)* array of items to further compare |

**Example**  
```js
var tardis = {"quality": "awesome"}
var smardis = {"quality": "shabby"}
var drWhoCar = {"quality": "awesome"}

// Returns true
AnyBoard.Utils.isEqual(tardis, drWhoCar)

// Returns false
AnyBoard.Utils.isEqual(tardis, smardis)
```
<a name="playDrawCallback"></a>
## playDrawCallback : <code>function</code>
This type of callback will be called when card is drawn or played

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> | that is played |
| player | <code>[Player](#AnyBoard.Player)</code> | that played the card |
| [options] | <code>object</code> | *(optional)* custom options as extra parameter when AnyBoard.Player.play was called |

<a name="simpleEventCallback"></a>
## simpleEventCallback : <code>function</code>
Type of callback called upon triggering of events

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | *(optional)* options called with the triggering of that event |

<a name="tokenTokenEventCallback"></a>
## tokenTokenEventCallback : <code>function</code>
Type of callback called upon token-token events, i.e. when two tokens interact with eachother, wuch
as 'STACK_ON', 'NEXT_TO'

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| initiatingToken | <code>[BaseToken](#AnyBoard.BaseToken)</code> | token whose interaction with has triggered the event |
| respondingToken | <code>[BaseToken](#AnyBoard.BaseToken)</code> | token that initiatingToken has interacted with |
| [options] | <code>object</code> | *(optional)* options called with the triggering of that event |

<a name="tokenEventCallback"></a>
## tokenEventCallback : <code>function</code>
Type of callback called upon triggering of a Token event, i.e. events triggered by the physical interaction
with tokens, such as 'LIFT', 'SHAKE', 'TURN'

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>[BaseToken](#AnyBoard.BaseToken)</code> | token that has been interacted with |
| [options] | <code>object</code> | *(optional)* options called with the triggering of that event |

<a name="tokenConstraintEventCallback"></a>
## tokenConstraintEventCallback : <code>function</code>
Type of callback called upon triggering of a Token-Constraint event, i.e. events triggered by the physical interaction
of a token upon a constraint, such as 'MOVED_TO'

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>[BaseToken](#AnyBoard.BaseToken)</code> | token that triggered the event |
| constraint | <code>string</code> | constraint that has been interacted with. Currently only a string representation. |
| [options] | <code>object</code> | *(optional)* options called with the triggering of that event |

<a name="stdStringCallback"></a>
## stdStringCallback : <code>function</code>
Generic callback returning a string param

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| string | <code>string</code> | 

<a name="stdBoolCallback"></a>
## stdBoolCallback : <code>function</code>
Generic callback returning a bool param

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| boolean | <code>boolean</code> | 

<a name="stdNoParamCallback"></a>
## stdNoParamCallback : <code>function</code>
Generic callback without params

**Kind**: global typedef  
<a name="onScanCallback"></a>
## onScanCallback : <code>function</code>
Type of callback called upon detecting a token

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>[BaseToken](#AnyBoard.BaseToken)</code> | discovered token |

<a name="stdErrorCallback"></a>
## stdErrorCallback : <code>function</code>
This type of callback will be called upon failure to complete a function

**Kind**: global typedef  

| Param | Type |
| --- | --- |
| errorMessage | <code>string</code> | 

