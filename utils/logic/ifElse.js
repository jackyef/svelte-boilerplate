const result = value => typeof value === 'function' ? value() : value;

export default condition => {
  return (ifTrue, ifFalse) => {
    return condition ? result(ifTrue) : (ifFalse);
  }
}
