export default function filter(args) {
  return args.map(arg => {
    if (arg instanceof Object) {
      return JSON.stringify(arg, undefined, 2);
    }
    return arg;
  }).join(', ');
}
