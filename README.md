# Syscript

A type-first script like compiled language to be used in all kinds of projects.

```sy
// main.sy

/* This is the entry point to your program */

fn main(argc: uint32, argv: string[]) {
	print("Hello", "World!");
}
```

```sh
sysc main.sy -o helloworld
./helloworld
```