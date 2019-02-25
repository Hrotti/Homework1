//NOTES
{
/*
Armor is 50 = 50% damage reduction.
This is currently not limited to <=100 or >=0
It would be easy to do so.

I currently am not checking for buffs of the same name. 
That means buffs will stack freely.

Damage types and armor types have interactions.
I have the armor types commented.
Each '+' is representing 33% increase in damage against that armor.
The '-' is 33% as well but '---' is only 90% reduction.
Example: Light (l) takes 33% more damage from Riercing (p) and Magic (m)

I honestly don't remember what we ended up on in regards to hitstun.
I am just going to assume it exists.
Can work to change.

Systems I think should be unconstrained:
    Health and armor
Systems I think should have a lower limit (0):
    Attack speed, Move speed, and Cast speed
Systems I think should have an upper limit:
    ?
Systems I think should have both limits:
    ?
These systems will be confusing to control so for now I will not constrain any of them.
That means things like negative speed is completele Rossible.
*/

//THIS SHOULD BE ADDED TO UNIT TYPES OR HERO/MONSTER
/*
IN CONSTRUCTOR
    //CHANGES
    this.acceleration = {x:2,y:2};//Place holder values
    this.velocity = {x:0,y:0};
    this.isStunned = false;
    this.isSilenced = false;
    this.isBlind = false;
    this.isDisarmed = false;
    this.baseMaxMovespeed = 100;
    this.maxMovespeedRatio = 1;
    this.maxMovespeedAdj = 0;
    this.currentHealth = 1000;
    //ahhhhh
    //Things at the Roint of calculation will either be:
    //totalAttackDamage = attackDamage * Ratio + Adj <== This for now. Can be changed.
    //or
    //totalAttackDamage = (attackDamage + Adj) * Ratio
    this.baseMaxHealth = 1000;
    this.maxHealthAdj = 0;
    this.maxHealthRatio = 1;
    this.armorRatio = 1;
    this.armorAdj = 0;
    this.baseAttackSpeed = 100;
    this.attackSpeedAdj = 0;
    this.attackSpeedRatio = 1;
    this.baseCastSpeed = 100;
    this.castSpeedAdj = 0;
    this.castSpeedRatio = 1;
    this.baseAttackDamage = 100;
    this.attackDamageAdj = 0
    this.attackDamageRatio = 1;
    this.baseMagicDamage = 100;
    this.magicDamageRatio = 1;
    this.cooldownRate = 1;
    this.cooldownAdj = 0;//Calculated RER ABILITY
NEW FUNCTION
unit.prototype.ChangeHealth = (amount) => {
    if (amount > 0){
        //display healing animation
        //maybe have a health change threshold 
        //to actually have it display
    } else if (amount < 0){
        //display damage animation
        //maybe have a health change threshold 
        //to actually have it display
    }
    this.health += amount;
}
unit.prototype.isValidHit = (theDamageObj) => {
    let d;
    let y = true;
    for (d in this.damageObj){
        if (d === theDamageObj){
            y = false;
        }
    }
    return y;
}
IN UPDATE
    let dmgObj;
    let dmgRemove = [];
    let dmgFlag;
    let buffObj;
    let buffRemove = [];
    let buffFlag;
    for(dmgObj in this.damageObj){//Updates damage objects
        dmgObj.update();
        if (dmgObj.timeLeft <= 0){
            dmgRemove.push(dmgObj);//Adds to trash system
        }
    }
    for(buffObj in this.buff){//Updates buff objects
        buffObj.update(this);
        if (buffObj.timeLeft <= 0){
            buffRemove.push(buffObj);//Adds to trash system
        }
    }
    for(dmgFlag in dmgRemove){//Removes flagged damage objects
        damageObj.splice(damageObj
            .findIndex((element) => {return element === dmgFlag;})
            ,1);
    }
    for(buffFlag in buffRemove){//Removes flagged buff objects
        buffObj.splice(buffObj
            .findIndex((element) => {return element === buffFlag;})
            ,1);
    }
*///END OF WHAT SHOULD BE ADDED TO UNIT OR HERO/MONSTER






}
//SELF NOTES
{
/*
SELF NOTES

Add a buff constraint so that the unit cannot receive two buffs of equal title.

Add constrains to systems that should be constrained

Make a set of premade buffs i.e. 'weak slow, slow, strong slow'

Add Effects:
*/
}
/**
 * Damage types
 * @Normal deals 33% more damage to Heavy.
 * @Slashing deals 33% more damage to Unarmored and 33% less damage to Medium.
 * @Piercing deals 33% more damage to Unarmored and Light
 * @Bludgeoning deals 66% more damage to Unarmored, 33% more damage to Light, and 33% less damage to Heavy.
 * @Magic deals 66% more damage to Ethereal, 33% more damage to Light and Heavy, and deals 33% less damage to Medium.
 * @Chaos deals 0% more damage to all armor types and deals 0% less damage to all armor types.
 * @True deals 0% more damage to all armor types and deals 0% less damage to all armor types.
 * @None Only use if entity should not have attack types considered. This is not a 'universal 1.0 damage mode'.
 */
const DTypes = {
    Normal: "n",
    Slashing: "s",
    Riercing: "p",
    Bludgeoning: "b",
    Magic: "m",
    Chaos: "c",//100% damage all time
    True: "t",//no distinction from chaos yet
    None: "na b"
}
/**
 * Armor types
 * @Unarmored takes bonus 33% damage from Riercing and Slashing.
 * @Light takes bonus 33% damage from Riercing and Magic.
 * @Medium takes bonus 33% damage from Normal, but 33% less damage from Riercing, Magic, and Slashing.
 * @Heavy takes bonus 33% damage from Magic.
 * @Ethereal takes bonus 66% damage from Magic, but 90% less damage from all other attack types.
 * @None Only use if entity should not have armor types considered. This is not a 'universal 1.0 damage mode'.
 */
const ATypes = {
    Unarmored: "ua",//+p,s ++b
    Light: "l",//+p,m +b
    Medium: "m",//+n  -p,m,s
    Heavy: "h",//+m, -b
    Ethereal: "e",//++m   ---all
    None: "na a"
}
/**
 * Effect types
 * F represents a flat change while R represents a Ratio change
 * F uses +=, R uses *=.
 * @MoveSpeed       Changes unit movespeed:
 * @Acceleration    Changes unit acceleration: acceleration is normally small. be careful with flat change.
 * @CurrentHealth   Changes unit current health.
 * @MaxHealth       Changes unit max health: Only affects current hp if max hp < current hp.
 * @AttackSpeed     Changes unit attack speed.
 * @AttackDamage    Changes unit attack damage: '-'damage will heal
 * @MagicDamage     Changes unit magic damage.
 * @Armor           Changes unit armor.
 * @CastSpeed       Changes unit cast speed.
 * @CooldownRate    Changes unit cooldown rates: flat adjustment is applied to each ability.
 * @Stun            Changes units stuned condition.
 * @Silence         Changes units silenced condition.
 * @Blind           Changes units blinded condition.
 * @Disarm          Changes units disarmed condition.
 */
const ETypes = {
    //Movement Speed
    MoveSpeedF: "move speed f",//Flat speed change
    MoveSpeedR: "move speed r",//Percent speed change
    //Acceleration
    AccelerationF: "acceleration f",//Be carful with this
    AccelerationR: "acceleration r",
    //Current Health
    CurrentHealthF: "current health f",
    CurrentHealthR: "current health r",
    //Max Health
    MaxHealthF: "max health f",
    MaxHealthR: "max health r",
    //Attack Speed
    AttackSpeedF: "attack speed f",
    AttackSpeedR: "attack speed r",
    //Attack Damage
    AttackDamageF: "attack damage f",
    AttackDamageR: "attack damage r",
    //Magic Damage
    MagicDamagef: "magic damage f",
    MagicDamageR: "magic damage r",
    //Armor
    ArmorF: "armor f",
    ArmorR: "armor r",
    //Cast Speed
    CastSpeedF: "cast speed f",
    CastSpeedR: "cast speed r",
    //Cooldown
    CooldownRateF: "cooldown rate f",
    CooldownRateR: "cooldown rate r",
    //MISC
    Silence: "silence",
    Stun: "stun",
    Disarm: "disarm",
    Blind: "blind",

    None: "na e"

}
const PremadeBuffs = {
    Slow: new BuffObj("slow",[new EffectObj(ETypes.MoveSpeedR, 0.6, 1/0.6, 120,0)]),
    SlowWeak: new BuffObj("weak slow",[new EffectObj(ETypes.MoveSpeedR, 0.8, 1/0.8, 120,0)]),
    SlowStrong: new BuffObj("strong slow",[new EffectObj(ETypes.MoveSpeedR, 0.4, 1/0.4, 120,0)]),
    Heal: new BuffObj("heal",[new EffectObj(ETypes.CurrentHealthF, 200, 0, 2, 0)]),
    HealStrong: new BuffObj("strong heal",[new EffectObj(ETypes.CurrentHealthF, 300, 0, 2, 0)]),
    HealWeak: new BuffObj("weak heal",[new EffectObj(ETypes.CurrentHealthF, 100, 0, 2, 0)]),
    HealOvertime: new BuffObj("heal overtime",[new EffectObj(ETypes.CurrentHealthF, 20, 0, 120, 10)]),
    DamageOvertime: new BuffObj("damage overtime",[new EffectObj(ETypes.CurrentHealthF, -35, 0, 120,20)]),
    PurifyingFlames: new BuffObj("purifying flames",[new EffectObj(ETypes.CurrentHealthF, -250, 0, 2, 0)
                                                    ,new EffectObj(ETypes.CurrentHealthF, 320/(180/5), 0, 180, 5)]),
}
function DamageSystem(){
    //I don't know what I would put in here as of yet.
}
/**
 * Creates a damage object which is the main holder of the damage and buff systems.
 * @param {*} dmg The amount of damage this object will do. Keep Rositive as this will be subtracted from unit health.
 * @param {*} stun The amount of hitstun being added to target.
 * @param {*} dmgType The damage type of the damage object.
 * @param {*} buffObj The buff object to apply to the unit.
 * @returns Damage Object
 */
DamageSystem.prototype.CreateDamageObject = (theDamage = 0, theHitstun = 0, 
                                            theDamageType = DTypes.None, 
                                            theBuffObject = null) => {
    return new DamageObj(theDamage,theHitstun,theDamageType,theBuffObject);
}
/**
 * Creates a buff object that holds the list of effects and is in charge of managing them.
 * The duration is based on the longest duration in the effect list.
 * @param {*} theName is just that... a name.
 * @param {*} theEffectList is a list of effect obejcts. 
 * @returns Buff Object
 */
DamageSystem.prototype.CreateBuffObject = (theName = "", theEffectList = []) => {
    return new BuffObj(theName, theEffectList);
}
/**
 * Creates an object that holds a single effect.
 * @param {*} theEffect The effect type.
 * @param {*} theDo The number to apply with '+' or '*'.
 * @param {*} theUndo The number to apply at the end of duration with '+' or '*'.
 * @param {*} theDuration The number of frames the effect lasts.
 * @param {*} theInterval The number of frames until the effect is applied again. '0' for one time effects.
 * @param {*} theOperation A special function to be passed in that has the parameter (unit) with no return value. Can be left null.
 * @returns Effect Object
 */
DamageSystem.prototype.CreateEffectObject = (theEffect = ETypes.None,theDo = 0
    ,theUndo = 0,theDuration = 0,theInterval = 0,theOperation) => {
    return new EffectObj(theEffect,theDo,theUndo,theDuration,theInterval,theOperation);        
}

/**
 * Applies the do effect to unit based on effect type
 */
EffectObj.prototype.Do = (unit) => {
    if (timeLeft <= 0){break;}
    if(this.interval > 0 || !this.isApplied){
        isApplied = true;
        switch (this.effect){
            case ETypes.MoveSpeedF:
                unit.maxMovespeedAdj += this.do;
                break;
            case ETypes.MoveSpeedR:
                unit.maxMovespeedRatio *= this.do;
                break;
            case ETypes.AccelerationF:
                unit.acceleration.x += this.do;
                unit.acceleration.y += this.do;
                break;
            case ETypes.AccelerationR:
                unit.acceleration.x *= this.do;
                unit.acceleration.y *= this.do;
                break;
            case ETypes.CurrentHealthF:
                unit.currentHealth += this.do;
                break;
            case ETypes.CurrentHealthR:
                unit.currentHealth *= this.do;
                break;
            case ETypes.MaxHealthF:
                unit.maxHealth += this.do;
                break;
            case ETypes.MaxHealthR:
                unit.maxHealth *= this.do;
                break;
            case ETypes.MagicDamagef:
                unit.magicDamageAdj += this.do;
                break;
            case ETypes.MagicDamageR:
                unit.magicDamageRatio *= this.do;
                break;
            case ETypes.AttackSpeedF:
                unit.attackSpeedAdj += this.do;
                break;
            case ETypes.AttackSpeedR:
                unit.attackSpeedRatio *= this.do;
                break;
            case ETypes.AttackDamageF:
                unit.attackDamageAdj += this.do;
                break;
            case ETypes.AttackDamageR:
                unit.attackDamageRatio *= this.do;
                break;
            case ETypes.ArmorF:
                unit.armorAdj += this.do;
                break;
            case ETypes.ArmorR:
                unit.armorRatio *= this.do;
                break;
            case ETypes.CastSpeedF:
                unit.castSpeedAdj += this.do;
                break;
            case ETypes.CastSpeedR:
                unit.castSpeedRatio *= this.do;
                break;
            case ETypes.Silence:
                unit.isSilenced = this.do;
                break;
            case ETypes.Stun:
                unit.isStunned = this.do;
                break;
            case ETypes.Disarm:
                unit.isDisarmed = this.do;
                break;
            case ETypes.Blind:
                unit.isBlind = this.do;
                break;
            case ETypes.None:
                break;
        }
    }
}
//ALL NUMBERS WILL BE ADDED OR MULTIPLIED
//Negative nubers will be required in order to reduce health etc
/**
 * An object that holds a single effect.
 * @param {*} theEffect The effect type.
 * @param {*} theDo The number to apply with '+' or '*'.
 * @param {*} theUndo The number to apply at the end of duration with '+' or '*'.
 * @param {*} theDuration The number of frames the effect lasts.
 * @param {*} theInterval The number of frames until the effect is applied again. '0' for one time effects.
 * @param {*} theOperation A special function to be passed in that has the parameter (unit) with no return value.
 */
function EffectObj(theEffect = ETypes.None,theDo = 0,theUndo = 0
                    ,theDuration = 0,theInterval = 0, theOperation = null){
    this.effect = theEffect;
    this.do = theDo;//Either a flat number or multiplier. Applied once or #duration/interval
    this.undo = theUndo;//Either a flat number or multiplier. Only applied ONCE
    this.duration = theDuration;//Number of game ticks to happen
    this.interval = theInterval;//How often the effect is applied or 0
    this.intervalTimer = 0;
    this.timeLeft = this.duration;//Timeleft until it no longer does.
    this.isApplied = false;
    this.undone = false;
    this.Operation = theOperation;
}
/**
 * Applies the undo effect on the unit based on effect type
 */
EffectObj.prototype.Undo = (unit) => {
    if (this.timeLeft <= 0 && !this.undone){
        this.undone = true;
        //Undo
        switch (this.effect){
            case ETypes.MoveSpeedF:
                unit.maxMovespeedAdj += this.undo;
                break;
            case ETypes.MoveSpeedR:
                unit.maxMovespeedRatio *= this.undo;
                break;
            case ETypes.AccelerationF:
                unit.acceleration.x += this.undo;
                unit.acceleration.y += this.undo;
                break;
            case ETypes.AccelerationR:
                unit.acceleration.x *= this.undo;
                unit.acceleration.y *= this.undo;
                break;
            case ETypes.CurrentHealthF:
                unit.currentHealth += this.undo;
                break;
            case ETypes.CurrentHealthR:
                unit.currentHealth *= this.undo;
                break;
            case ETypes.MaxHealthF:
                unit.maxHealth += this.undo;
                break;
            case ETypes.MaxHealthR:
                unit.maxHealth *= this.undo;
                break;
            case ETypes.MagicDamagef:
                unit.magicDamageAdj += this.undo;
                break;
            case ETypes.MagicDamageR:
                unit.magicDamageRatio *= this.undo;
                break;
            case ETypes.AttackSpeedF:
                unit.attackSpeedAdj += this.undo;
                break;
            case ETypes.AttackSpeedR:
                unit.attackSpeedRatio *= this.undo;
                break;
            case ETypes.AttackDamageF:
                unit.attackDamageAdj += this.undo;
                break;
            case ETypes.AttackDamageR:
                unit.attackDamageRatio *= this.undo;
                break;
            case ETypes.ArmorF:
                unit.armorAdj += this.undo;
                break;
            case ETypes.ArmorR:
                unit.armorRatio *= this.undo;
                break;
            case ETypes.CastSpeedF:
                unit.castSpeedAdj += this.undo;
                break;
            case ETypes.CastSpeedR:
                unit.castSpeedRatio *= this.undo;
                break;
            case ETypes.Silence:
                unit.isSilenced = this.undo;
                break;
            case ETypes.Stun:
                unit.isStunned = this.undo;
                break;
            case ETypes.Disarm:
                unit.isDisarmed = this.undo;
                break;
            case ETypes.Blind:
                unit.isBlind = this.undo;
                break;
            case ETypes.None:
                break;
        }
    }
}
//This function object controls how damage is applied and 
//types along with buffs and hitstuns
/**
 * The main holder of the damage and buff systems.
 * @param {*} dmg The amount of damage this object will do. Keep Rositive as this will be subtracted from unit health.
 * @param {*} stun The amount of hitstun being added to target.
 * @param {*} dmgType The damage type of the damage object.
 * @param {*} buffObj The buff object to apply to the unit.
 */
function DamageObj(dmg = 0, stun = 0, 
                        dmgType = DTypes.None, 
                        buffObj = null) {
    this.damage = dmg;
    this.hitstun = stun;
    this.damageType = dmgType;
    this.buff = buffObj;
}
//Consideres armor type and damage type and armor then removes health from unit.
//Return: -healthChanged which is damage
/**
 * Applies damage to unit based on armor types and damage types. unit.HealthChange(-damage).
 * @returns The -damage total.
 */
DamageObj.prototype.ApplyDamage = (unit) => {
    let unitArmor = unit.armor;
    let unitArmorType = unit.armorType;
    let dmgMultiplier = 1;
    let dt = this.damageType;
    //Determines damage multiplier considering armor and damage types
    switch (unitArmorType) {
        case ATypes.Unarmored:
            if (dt === DTypes.Piercing 
                || dt === DTypes.Slashing){
                    dmgMultiplier += 1/3;}
            break;
        case ATypes.Light:
            if (dt === DTypes.Piercing 
                || dt === DTypes.Magic){
                    dmgMultiplier += 1/3;}
            break;
        case ATypes.Medium:
            if (dt === DTypes.Normal) {
                    dmgMultiplier += 1/3;}
            if (dt === DTypes.Piercing
                ||dt === DTypes.Magic
                ||dt === DTypes.Slashing){
                    dmgMultiplier -= 1/3;}
            break;
        case ATypes.Heavy:
            if (dt === DTypes.Magic){
                    dmgMultiplier += 1/3;}
            break;
        case ATypes.Ethereal:
            if (dt === DTypes.Magic){
                    dmgMultiplier += 2/3;
                } else {
                    dmgMultiplier -= .9;
                }
            break;
    }
    let healthChange = this.damage*dmgMultiplier*(1-unitArmor/100);
    //unit.health -= healthChange;
    unit.ChangeHealth(-healthChange);//Negative b/c damage
    return -healthChange;
}
/**
 * Adds the buff object of the damage object to the unit buff list.
 */
DamageObj.prototype.ApplyBuff = (unit) => {
    let b;
    for(b in unit.buffObj){
        if (b.name === this.buff.name){return;}
    }
    unit.buffObj.push(this.buff);
}
/**
 * Adds the hitstun of the damage object to the unit hitstun.
 */
DamageObj.prototype.ApplyHitstun = (unit) => {
    unit.hitstun += this.hitstun;
}
/**
 * This is the main call to use when hitting a unit. Other functions should not be called.
 * @param unit The unit that the collision hits.
 */
DamageObj.prototype.ApplyEffects = (unit) => {
    if (!unit.isValidHit(this)){break;}//Needs to be added to unit types
    unit.damageObj.push(this);
    this.ApplyDamage(unit);
    this.ApplyHitstun(unit);
    this.ApplyBuff(unit);
}
/**
 * This buff object holds the list of effects and is in charge of managing them.
 * The duration is based on the longest duration in the effect list.
 * @param {*} theName is just that... a name.
 * @param {*} theEffectList is a list of effect obejcts. 
 */
function BuffObj(theName = "", theEffectList = []) {
    this.name = theName;
    //Duration will be the length of the longest effect.
    this.effectList = theEffectList;
    let max = -1;
    let e;
    for (e in this.effectList){
        max = Math.max(e.duration, max);
    }
    this.duration = max;
    this.timeLeft = this.duration;
}
/**
 * This function should be called by the unit in update.
 * This handles the updates of all effects in the buff object.
 * @param unit This should be 'this'.
 */
BuffObj.prototype.update = (unit) => {
    this.timeLeft--;
    let e;
    for (e in this.effectList){
        //e is effectobj
        if (e.intervalTimer <= 0){
            e.intervalTimer = e.interval;
            e.Operation(unit);
            e.Do(unit);
            e.Undo(unit);
        } else {e.intervalTimer --;}
        e.timeLeft--;
    }
}