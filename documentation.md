<a name="AnyBoard"></a>
## AnyBoard : <code>object</code>
Global variable AnyBoard.

**Kind**: global variable  

* [AnyBoard](#AnyBoard) : <code>object</code>
  * [.Deck](#AnyBoard.Deck)
    * [new AnyBoard.Deck(name, jsonDeck)](#new_AnyBoard.Deck_new)
    * _instance_
      * [.shuffle()](#AnyBoard.Deck+shuffle)
      * [.initiate(jsonDeck)](#AnyBoard.Deck+initiate)
      * [.refill(newDeck)](#AnyBoard.Deck+refill)
      * [._draw(player, options)](#AnyBoard.Deck+_draw) ⇒ <code>[Card](#AnyBoard.Card)</code>
      * [.onPlay(func)](#AnyBoard.Deck+onPlay)
      * [.onDraw(func)](#AnyBoard.Deck+onDraw)
    * _static_
      * [.get(name)](#AnyBoard.Deck.get) ⇒ <code>[Deck](#AnyBoard.Deck)</code>
  * [.Card](#AnyBoard.Card)
    * [new AnyBoard.Card(deck, options)](#new_AnyBoard.Card_new)
    * [.get(cardTitleOrID)](#AnyBoard.Card.get) ⇒ <code>[Card](#AnyBoard.Card)</code>
  * [.Dices](#AnyBoard.Dices)
    * [new AnyBoard.Dices(eyes, numOfDice)](#new_AnyBoard.Dices_new)
    * [.roll()](#AnyBoard.Dices+roll) ⇒ <code>number</code>
    * [.rollEach()](#AnyBoard.Dices+rollEach) ⇒ <code>Array</code>
  * [.Player](#AnyBoard.Player)
    * [new AnyBoard.Player(name, options)](#new_AnyBoard.Player_new)
    * _instance_
      * [.pay(resources, receivingPlayer)](#AnyBoard.Player+pay) ⇒ <code>boolean</code>
      * [.trade(giveResources, receiveResources, player)](#AnyBoard.Player+trade) ⇒ <code>boolean</code>
      * [.recieve(resourceSet)](#AnyBoard.Player+recieve)
      * [.draw(deck, options)](#AnyBoard.Player+draw) ⇒ <code>[Card](#AnyBoard.Card)</code>
      * [.play(card, customOptions)](#AnyBoard.Player+play) ⇒ <code>boolean</code>
    * _static_
      * [.get(name)](#AnyBoard.Player.get) ⇒ <code>[Player](#AnyBoard.Player)</code>
  * [.Hand](#AnyBoard.Hand)
    * [new AnyBoard.Hand(player, options)](#new_AnyBoard.Hand_new)
    * [.has(card, amount)](#AnyBoard.Hand+has) ⇒ <code>boolean</code>
    * [.add(card)](#AnyBoard.Hand+add)
  * [.Resource](#AnyBoard.Resource)
    * [new AnyBoard.Resource(name, properties)](#new_AnyBoard.Resource_new)
    * [.get(name)](#AnyBoard.Resource.get) ⇒ <code>[Resource](#AnyBoard.Resource)</code>
  * [.ResourceSet](#AnyBoard.ResourceSet)
    * [new AnyBoard.ResourceSet(resources, allowNegative)](#new_AnyBoard.ResourceSet_new)
    * [.contains(reqResource)](#AnyBoard.ResourceSet+contains) ⇒ <code>boolean</code>
    * [.add(resourceSet)](#AnyBoard.ResourceSet+add)
    * [.subtract(resourceSet)](#AnyBoard.ResourceSet+subtract) ⇒ <code>boolean</code>
    * [.similarities(resourceSet)](#AnyBoard.ResourceSet+similarities) ⇒ <code>object</code>
  * [.Logger](#AnyBoard.Logger)
    * [.message(level, message, sender)](#AnyBoard.Logger.message)
    * [.warn(message, sender)](#AnyBoard.Logger.warn)
    * [.error(message, sender)](#AnyBoard.Logger.error)
    * [.log(message, sender)](#AnyBoard.Logger.log)
    * [.debug(message, sender)](#AnyBoard.Logger.debug)

<a name="AnyBoard.Deck"></a>
### AnyBoard.Deck
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of Deck. |
| cards | <code>Array</code> | complete set of cards in the deck |
| pile | <code>Array</code> | remaining cards in this pile |
| usedPile | <code>Array</code> | cards played from this deck |
| autoUsedRefill | <code>boolean</code> | *(default: true)* whether or not to automatically refill pile from usedPile when empty. Is ignored if autoNewRefill is true. |
| autoNewRefill | <code>boolean</code> | *(default: false)* whether or not to automatically refill pile with a new deck when empty. |
| playListeners | <code>Array</code> | holds functions to be called when cards in this deck are played |
| drawListeners | <code>Array</code> | holds functions to be called when cards in this deck are drawn |


* [.Deck](#AnyBoard.Deck)
  * [new AnyBoard.Deck(name, jsonDeck)](#new_AnyBoard.Deck_new)
  * _instance_
    * [.shuffle()](#AnyBoard.Deck+shuffle)
    * [.initiate(jsonDeck)](#AnyBoard.Deck+initiate)
    * [.refill(newDeck)](#AnyBoard.Deck+refill)
    * [._draw(player, options)](#AnyBoard.Deck+_draw) ⇒ <code>[Card](#AnyBoard.Card)</code>
    * [.onPlay(func)](#AnyBoard.Deck+onPlay)
    * [.onDraw(func)](#AnyBoard.Deck+onDraw)
  * _static_
    * [.get(name)](#AnyBoard.Deck.get) ⇒ <code>[Deck](#AnyBoard.Deck)</code>

<a name="new_AnyBoard.Deck_new"></a>
#### new AnyBoard.Deck(name, jsonDeck)
Represents a Deck of Cards


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of Deck. This name can be used to retrieve the deck via AnyBoard.Deck.all[name]. |
| jsonDeck | <code>object</code> | loaded JSON file. See [examples-folder](./examples) for JSON format and loading. |

<a name="AnyBoard.Deck+shuffle"></a>
#### deck.shuffle()
Shuffles the pile of undrawn cards   .
Pile is automatically shuffled upon construction, and upon initiate(). New cards added upon refill() are also automatically shuffled.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  
<a name="AnyBoard.Deck+initiate"></a>
#### deck.initiate(jsonDeck)
Reads Deck from jsonObject and provides a shuffled version in pile.
Is automatically called upon constructing a deck.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Description |
| --- | --- | --- |
| jsonDeck | <code>object</code> | loaded json file. See [examples-folder](./examples) for example of json file and loading |

<a name="AnyBoard.Deck+refill"></a>
#### deck.refill(newDeck)
Manually refills the pile. This is not necessary if autoUsedRefill or autoNewRefill property of deck is true.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Description |
| --- | --- | --- |
| newDeck | <code>boolean</code> | *(default: false)* True if to refill with a new deck. False if to refill with played cards (from usedPile) |

<a name="AnyBoard.Deck+_draw"></a>
#### deck._draw(player, options) ⇒ <code>[Card](#AnyBoard.Card)</code>
NB: Helpfunction! Use player.draw(deck) instead.
Draws a card from the deck.
Refills pile if autoNewRefill or autoUsedRefill is true.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  
**Returns**: <code>[Card](#AnyBoard.Card)</code> - card card that is drawn, or undefined if pile is empty and autoRefill properties are false.  

| Param | Type | Description |
| --- | --- | --- |
| player | <code>[Player](#AnyBoard.Player)</code> | player that draws the card |
| options | <code>object</code> | *(optional)* custom options sent to drawListeners |

<a name="AnyBoard.Deck+onPlay"></a>
#### deck.onPlay(func)
Adds functions to be executed upon all Cards in this Deck.

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | function to be executed with the 3 parameters AnyBoard.Card, AnyBoard.Player, (options) when cards are played |

<a name="AnyBoard.Deck+onDraw"></a>
#### deck.onDraw(func)
Adds functions to be executed upon draw of Card from this Deck

**Kind**: instance method of <code>[Deck](#AnyBoard.Deck)</code>  

| Param | Type | Description |
| --- | --- | --- |
| func | <code>function</code> | function to be executed with the 3 parameters AnyBoard.Card, AnyBoard.Player, (options) when cards are drawn |

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
| playListeneres | <code>Array</code> | functions to be called upon play of this spesific card (in addition to playListeners on its belonging deck) |
| properties | <code>object</code> | dictionary that holds custom attributes |


* [.Card](#AnyBoard.Card)
  * [new AnyBoard.Card(deck, options)](#new_AnyBoard.Card_new)
  * [.get(cardTitleOrID)](#AnyBoard.Card.get) ⇒ <code>[Card](#AnyBoard.Card)</code>

<a name="new_AnyBoard.Card_new"></a>
#### new AnyBoard.Card(deck, options)
Represents a single Card (AnyBoard.Card)
Read from JSON file provided to Deck class.


| Param | Type | Description |
| --- | --- | --- |
| deck | <code>[Deck](#AnyBoard.Deck)</code> | deck to which the card belongs |
| options | <code>object</code> | options for the card |
| options.title | <code>string</code> | title of the card. |
| options.description | <code>string</code> | description for the Card |
| options.color | <code>string</code> | (optional) color of the Card |
| options.category | <code>string</code> | (optional) category of the card, not used by AnyBoard FrameWork |
| options.value | <code>number</code> | (optional) value of the card, not used by AnyBoard FrameWork |
| options.type | <code>string</code> | (optional) type of the card, not used by AnyBoard FrameWork |
| options.amount | <code>number</code> | (default: 1) amount of this card in the deck |
| options.yourAttributeHere | <code>any</code> | custom attributes, as well as specified ones, are all placed in card.properties. E.g. 'heat' would be placed in card.properties.heat. |

<a name="AnyBoard.Card.get"></a>
#### Card.get(cardTitleOrID) ⇒ <code>[Card](#AnyBoard.Card)</code>
Returns card with given id

**Kind**: static method of <code>[Card](#AnyBoard.Card)</code>  
**Returns**: <code>[Card](#AnyBoard.Card)</code> - card with given id (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| cardTitleOrID | <code>number</code> | id or title of card |

<a name="AnyBoard.Dices"></a>
### AnyBoard.Dices
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  

* [.Dices](#AnyBoard.Dices)
  * [new AnyBoard.Dices(eyes, numOfDice)](#new_AnyBoard.Dices_new)
  * [.roll()](#AnyBoard.Dices+roll) ⇒ <code>number</code>
  * [.rollEach()](#AnyBoard.Dices+rollEach) ⇒ <code>Array</code>

<a name="new_AnyBoard.Dices_new"></a>
#### new AnyBoard.Dices(eyes, numOfDice)
Represents a set of game dices that can be rolled to retrieve a random result.


| Param | Type | Description |
| --- | --- | --- |
| eyes | <code>number</code> | *(default 6)* number of max eyes on a roll with this dice |
| numOfDice | <code>number</code> | *(default: 1)* number of dices |

<a name="AnyBoard.Dices+roll"></a>
#### dices.roll() ⇒ <code>number</code>
Roll the dices and returns a the sum

**Kind**: instance method of <code>[Dices](#AnyBoard.Dices)</code>  
**Returns**: <code>number</code> - combined result of rolls for all dices  
<a name="AnyBoard.Dices+rollEach"></a>
#### dices.rollEach() ⇒ <code>Array</code>
Roll the dices and returns an array of results for each dice

**Kind**: instance method of <code>[Dices](#AnyBoard.Dices)</code>  
**Returns**: <code>Array</code> - list of results for each dice  
<a name="AnyBoard.Player"></a>
### AnyBoard.Player
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| hand | <code>[Hand](#AnyBoard.Hand)</code> | hand of cards (Quests) |
| faction | <code>string</code> | faction (Special abilities or perks) |
| class | <code>string</code> | class (Special abilities or perks) |
| holds | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | the resources belonging to this player |
| color | <code>string</code> | color representation of player |


* [.Player](#AnyBoard.Player)
  * [new AnyBoard.Player(name, options)](#new_AnyBoard.Player_new)
  * _instance_
    * [.pay(resources, receivingPlayer)](#AnyBoard.Player+pay) ⇒ <code>boolean</code>
    * [.trade(giveResources, receiveResources, player)](#AnyBoard.Player+trade) ⇒ <code>boolean</code>
    * [.recieve(resourceSet)](#AnyBoard.Player+recieve)
    * [.draw(deck, options)](#AnyBoard.Player+draw) ⇒ <code>[Card](#AnyBoard.Card)</code>
    * [.play(card, customOptions)](#AnyBoard.Player+play) ⇒ <code>boolean</code>
  * _static_
    * [.get(name)](#AnyBoard.Player.get) ⇒ <code>[Player](#AnyBoard.Player)</code>

<a name="new_AnyBoard.Player_new"></a>
#### new AnyBoard.Player(name, options)
Represents a Player (AnyBoard.Player)


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of the player |
| options | <code>object</code> | *(optional)* options for the player |
| options.color | <code>string</code> | *(optional)* color representing the player |
| options.faction | <code>string</code> | *(optional)* faction representing the player |
| options.class | <code>string</code> | *(optional)* class representing the player |
| options.yourAttributeHere | <code>any</code> | custom attributes, as well as specified ones, are all placed in player.properties. E.g. 'age' would be placed in player.properties.age. |

<a name="AnyBoard.Player+pay"></a>
#### player.pay(resources, receivingPlayer) ⇒ <code>boolean</code>
Take resources from this player and give to receivingPlayer.

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>boolean</code> - whether or not transaction was completed (fale if Player don't hold enough resources)  

| Param | Type | Description |
| --- | --- | --- |
| resources | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | dictionary of resources |
| receivingPlayer | <code>[Player](#AnyBoard.Player)</code> | *(optional)* Who shall receive the resources. Omit if not to anyone |

<a name="AnyBoard.Player+trade"></a>
#### player.trade(giveResources, receiveResources, player) ⇒ <code>boolean</code>
Trade resources between players/game

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>boolean</code> - false if any of the players doesn't hold enough resources  

| Param | Type | Description |
| --- | --- | --- |
| giveResources | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | resources this player shall give |
| receiveResources | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | resources this player receieves |
| player | <code>[Player](#AnyBoard.Player)</code> | *(optional)* Who shall be traded with. Omit if not to a player, but to game. |

<a name="AnyBoard.Player+recieve"></a>
#### player.recieve(resourceSet)
Receive resource from bank/game. Use pay() when receiving from players.

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | resources to be added to this players bank |

<a name="AnyBoard.Player+draw"></a>
#### player.draw(deck, options) ⇒ <code>[Card](#AnyBoard.Card)</code>
Draws a card from a deck and puts it in the hand of the player

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>[Card](#AnyBoard.Card)</code> - card that is drawn  

| Param | Type | Description |
| --- | --- | --- |
| deck | <code>[Deck](#AnyBoard.Deck)</code> | deck to be drawn from |
| options | <code>object</code> | *(optional)* parameters to be sent to the drawListeners on the deck |

<a name="AnyBoard.Player+play"></a>
#### player.play(card, customOptions) ⇒ <code>boolean</code>
Plays a card from the hand. If the hand does not contain the card, the card is not played and the hand unchanged.

**Kind**: instance method of <code>[Player](#AnyBoard.Player)</code>  
**Returns**: <code>boolean</code> - isPlayed whether or not the card was played  

| Param | Type | Description |
| --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> | card to be played |
| customOptions | <code>object</code> | *(optional)* custom options that the play should be played with |

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
  * [new AnyBoard.Hand(player, options)](#new_AnyBoard.Hand_new)
  * [.has(card, amount)](#AnyBoard.Hand+has) ⇒ <code>boolean</code>
  * [.add(card)](#AnyBoard.Hand+add)

<a name="new_AnyBoard.Hand_new"></a>
#### new AnyBoard.Hand(player, options)
Represents a Hand of a player, containing cards.


| Param | Type | Description |
| --- | --- | --- |
| player | <code>[Player](#AnyBoard.Player)</code> | player to which this hand belongs |
| options | <code>object</code> | *(optional)* custom properties added to this hand |

<a name="AnyBoard.Hand+has"></a>
#### hand.has(card, amount) ⇒ <code>boolean</code>
Checks whether or not a player has an amount card in this hand.

**Kind**: instance method of <code>[Hand](#AnyBoard.Hand)</code>  
**Returns**: <code>boolean</code> - hasCard whether or not the player has that amount or more of that card in this hand  

| Param | Type | Description |
| --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> | card to be checked if is in hand |
| amount | <code>number</code> | (default: 1)* amount of card to be checked if is in hand |

<a name="AnyBoard.Hand+add"></a>
#### hand.add(card)
Adds a card to the hand of a player

**Kind**: instance method of <code>[Hand](#AnyBoard.Hand)</code>  

| Param | Type | Description |
| --- | --- | --- |
| card | <code>[Card](#AnyBoard.Card)</code> | card to be added to this hand |

<a name="AnyBoard.Resource"></a>
### AnyBoard.Resource
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of resource |
| properties | <code>string</code> | *(optional)* custom options added to resource |


* [.Resource](#AnyBoard.Resource)
  * [new AnyBoard.Resource(name, properties)](#new_AnyBoard.Resource_new)
  * [.get(name)](#AnyBoard.Resource.get) ⇒ <code>[Resource](#AnyBoard.Resource)</code>

<a name="new_AnyBoard.Resource_new"></a>
#### new AnyBoard.Resource(name, properties)
Represents a simple resource (AnyBoard.Resource)


| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name representing the resource |
| properties | <code>object</code> | custom properties of this resource |

<a name="AnyBoard.Resource.get"></a>
#### Resource.get(name) ⇒ <code>[Resource](#AnyBoard.Resource)</code>
Returns resource with given name

**Kind**: static method of <code>[Resource](#AnyBoard.Resource)</code>  
**Returns**: <code>[Resource](#AnyBoard.Resource)</code> - resource with given name (or undefined if non-existent)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | name of resource |

<a name="AnyBoard.ResourceSet"></a>
### AnyBoard.ResourceSet
**Kind**: static class of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| resources | <code>object</code> | *(optional)* a set of initially contained resources |
| allowNegative | <code>boolean</code> | *(default: false)*  whether or not to allow being subtracted resources to below 0 (dept) |


* [.ResourceSet](#AnyBoard.ResourceSet)
  * [new AnyBoard.ResourceSet(resources, allowNegative)](#new_AnyBoard.ResourceSet_new)
  * [.contains(reqResource)](#AnyBoard.ResourceSet+contains) ⇒ <code>boolean</code>
  * [.add(resourceSet)](#AnyBoard.ResourceSet+add)
  * [.subtract(resourceSet)](#AnyBoard.ResourceSet+subtract) ⇒ <code>boolean</code>
  * [.similarities(resourceSet)](#AnyBoard.ResourceSet+similarities) ⇒ <code>object</code>

<a name="new_AnyBoard.ResourceSet_new"></a>
#### new AnyBoard.ResourceSet(resources, allowNegative)
Creates a ResourceSet (AnyBoard.ResourceSet)


| Param | Type | Description |
| --- | --- | --- |
| resources | <code>object</code> | *(optional)* a set of initially contained resources |
| allowNegative | <code>boolean</code> | *(default: false)*  whether or not to allow being subtracted resources to below 0 (dept) |

<a name="AnyBoard.ResourceSet+contains"></a>
#### resourceSet.contains(reqResource) ⇒ <code>boolean</code>
Whether or not a ResourceSet contains another ResourceSet

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  
**Returns**: <code>boolean</code> - true if this ResourceSet contains reqResource, else false  

| Param | Type | Description |
| --- | --- | --- |
| reqResource | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | ResourceSet to be compared against |

<a name="AnyBoard.ResourceSet+add"></a>
#### resourceSet.add(resourceSet)
Adds a ResourceSet to this one

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | ResourceSet to be added to this one |

<a name="AnyBoard.ResourceSet+subtract"></a>
#### resourceSet.subtract(resourceSet) ⇒ <code>boolean</code>
Subtracts a dictionary of resources and amounts to a ResourceSet

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  
**Returns**: <code>boolean</code> - whether or not resources were subtracted successfully  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | set of resources to be subtracted |

<a name="AnyBoard.ResourceSet+similarities"></a>
#### resourceSet.similarities(resourceSet) ⇒ <code>object</code>
Returns the common resources and minimum amount between a dictionary of resources and amounts, and this ResourceSet

**Kind**: instance method of <code>[ResourceSet](#AnyBoard.ResourceSet)</code>  
**Returns**: <code>object</code> - similarities dictionary of common resources and amounts  

| Param | Type | Description |
| --- | --- | --- |
| resourceSet | <code>[ResourceSet](#AnyBoard.ResourceSet)</code> | dictionary of resources and amounts to be compared against |

<a name="AnyBoard.Logger"></a>
### AnyBoard.Logger
**Kind**: static property of <code>[AnyBoard](#AnyBoard)</code>  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| threshold | <code>number</code> | *(default: 10)* sets a threshold on whether or not to log an event. debugLevel will be used instead if threshold is lower. |
| debugLevel | <code>number</code> | *(default: 0)* sets a threshold for when a log should be considered a debug log event. |
| normalLevel | <code>number</code> | *(default: 10)* sets a threshold for when a log should be considered a normal log event. |
| warningLevel | <code>number</code> | *(default: 20)* sets a threshold for when a log should be considered a warning. |
| errorLevel | <code>number</code> | *(default: 30)* sets a threshold for when a log should be considered a fatal error. |
| loggerObject | <code>function</code> | *(default: console)* logging method. Must have implemented .debug(), .log(), .warn() and .error() |


* [.Logger](#AnyBoard.Logger)
  * [.message(level, message, sender)](#AnyBoard.Logger.message)
  * [.warn(message, sender)](#AnyBoard.Logger.warn)
  * [.error(message, sender)](#AnyBoard.Logger.error)
  * [.log(message, sender)](#AnyBoard.Logger.log)
  * [.debug(message, sender)](#AnyBoard.Logger.debug)

<a name="AnyBoard.Logger.message"></a>
#### Logger.message(level, message, sender)
logs if threshold <= level parameter

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| level | <code>level</code> | of severity |
| message | <code>string</code> | event to be logged |
| sender | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.warn"></a>
#### Logger.warn(message, sender)
logs a warning. Ignored if threshold > this.warningLevel (default: 20)

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| sender | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.error"></a>
#### Logger.error(message, sender)
logs an error. Will never be ignored.

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| sender | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.log"></a>
#### Logger.log(message, sender)
logs a normal event. Ignored if threshold > this.normalLevel (default: 10)

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| sender | <code>object</code> | *(optional)* sender of the message |

<a name="AnyBoard.Logger.debug"></a>
#### Logger.debug(message, sender)
logs debugging information. Ignored if threshold > this.debugLevel (default: 0)

**Kind**: static method of <code>[Logger](#AnyBoard.Logger)</code>  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>string</code> | event to be logged |
| sender | <code>object</code> | *(optional)* sender of the message |

