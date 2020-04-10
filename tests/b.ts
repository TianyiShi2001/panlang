import { ENGINES } from "./_engines";

const { ruby } = ENGINES.ruby;
const { python } = ENGINES.python;
const { scala } = ENGINES.scala;
const { sh, bash, csh, dash, ksh, tcsh, zsh } = ENGINES.shell;
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

const { clang, gcc } = ENGINES.c;
const { go } = ENGINES.go;

const c_hello = `\
#include <stdio.h>
int main() {
   // printf() displays the string inside quotation
   printf("hello");
   return 0;
}
`;

gcc(c_hello)
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
clang(c_hello)
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
go();

const go_hello = `\
package main
import "fmt"
func main() {
    fmt.Println("hello")
}
`;

go(go_hello)
  .then((res) => console.log(res.output))
  .catch((res) => console.error(res.error));
