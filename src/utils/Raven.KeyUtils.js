var Raven = Raven || {};

// Key map
var Key = {
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,

  CMD: 91,
  CTRL: 17,
  SHIFT: 16,
  CAPS: 20,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  DELETE: 46,
  BACKQUOTE: 192,
  MINUS: 189,
  EQUAL: 187,
  LEFTBRACKET: 219,
  RIGHTBRACKET: 221,
  BACKSLASH: 220,
  SEMICOLON: 186,
  QUOTE: 222,
  COMMA: 188,
  PERIOD: 190,
  SLASH: 191,
  
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  NUMBER_0: 48,
  NUMBER_1: 49,
  NUMBER_2: 50,
  NUMBER_3: 51,
  NUMBER_4: 52,
  NUMBER_5: 53,
  NUMBER_6: 54,
  NUMBER_7: 55,
  NUMBER_8: 56,
  NUMBER_9: 57,
  
  getKey: function(keyCode) {
    for(var obj in this) {
      if(this[obj] == keyCode) return obj;
    }
    return null;
  }
};
