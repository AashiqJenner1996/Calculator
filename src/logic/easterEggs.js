// Easter egg should NEVER throw - it should just quietly return null if input is not numeric
import evilGIF from '../assets/Evil.gif';
import sixSevenGIF from '../assets/sixseven.gif';
import tripleGIF from '../assets/Triple.gif';


export function EasterEgg(raw) {
  const num = Number(raw);
  if (Number.isNaN(num)) {
    return null;
  }

  if (num === 666) return {
    code : 666,
    message : "You have summoned an evil spirit",
    media: evilGIF
    };
  if (num === 420) return {
    code: 420,
    message: "OH BAYBE A TRIPLE!",
    media: tripleGIF
    };
  if (num === 67) return {
    code: 67,
    message: "I'm too old to understand this one, sorry",
    media: sixSevenGIF
    };

  return null;
}
