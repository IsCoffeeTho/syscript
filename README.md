# SyScript

A Type First Script like language that can be compiled down to multiple binary formats

```
// main.sy

/* This is the entry point to your program */
fn main(argc: uint32, argv: string[]) {
	print("Hello", "World!");
}
```

```sh
sysc main.sy
```