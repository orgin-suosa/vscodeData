// main() {
//     getEmoji(10).forEach(print);
//   }
   
//   Iterable<String> getEmoji(int count) sync* {
//     Runes first = Runes('\u{1f47f}');
//     for (int i = 0; i < count; i++) {
//       yield String.fromCharCodes(first.map((e) => e + i));
//     }
//   }
  
//   console.log(gen.next())
//   console.log(gen.next())
//   console.log(gen.next())
//   console.log(gen.next())

function greet(person: string) {
    return 'Hello, ' + person;
  }
  
  console.log(greet("TypeScript"));
  