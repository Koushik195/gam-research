// GAM Research rating rule: the rating follows the upside from the current price to our
// 12-month target price (our fair value for the stock).
//   BUY   upside of +15% or more
//   HOLD  upside between −5% and +15%
//   SELL  upside below −5%
const RULE = { buy: 15, sell: -5 };

const ratingFor = upside => (upside >= RULE.buy ? 'BUY' : upside < RULE.sell ? 'SELL' : 'HOLD');
const RANK = { SELL: 0, HOLD: 1, BUY: 2 };
// Price levels at which a target implies each rating (for "buy below / sell above" lines).
const buyBelow = tp => tp / (1 + RULE.buy / 100);
const sellAbove = tp => tp / (1 + RULE.sell / 100);
const ruleText = `Our ratings follow the upside to our 12-month target: BUY at +${RULE.buy}% or more, HOLD between ${RULE.sell}% and +${RULE.buy}%, SELL below ${RULE.sell}%.`.replace(/-/g, '−');

module.exports = { RULE, RANK, ratingFor, buyBelow, sellAbove, ruleText };
