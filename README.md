# panlang

Run any code in Node.js

## Demo

```js
import { Engines } from "panlang";
```

```js
const { ruby } = Engines.ruby;
const { python } = Engines.python;
const { scala } = Engines.scala;
const { sh, bash, csh, dash, ksh, tcsh, zsh } = Engines.shell;
ruby("puts 'hello from ruby!'")
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
python("print('hello from python!')")
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
bash("echo hello from bash!")
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
scala('println("hello from scala!")')
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
```

```
hello from bash!
hello from python!
hello from ruby!
hello from scala!
```

Compiled languages? Alternative compilers? No problem!

```js
const { clang, gcc } = Engines.c;
const { go } = Engines.go;

const c_hello = `\
#include <stdio.h>
int main() {
   // printf() displays the string inside quotation
   printf("hello from c ");
   return 0;
}
`;

gcc(c_hello)
  .then((res) => console.log(res.output + 'via gcc!'))
  .catch((res) => console.error(res.error));
clang(c_hello)
  .then((res) => console.log(res.output + 'via clang!'))
  .catch((res) => console.error(res.error));
go();

const go_hello = `\
package main
import "fmt"
func main() {
    fmt.Println("hello from go!")
}
`;

go(go_hello)
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
```

```
hello from c via gcc!
hello from c via clang!
hello from go!
```