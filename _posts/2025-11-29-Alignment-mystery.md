---
layout: post
title: Memory alignment mystery
---

While playing with C, I encountered this interesting alignment padding behaviour in `struct`.

For `struct` as follows:
```c
struct AlignmentCheck {
  char c;
  double d;
  int a;
};
```

Here `char` takes 1 byte, `double` takes 8 bytes, `int` takes 4 bytes. However, we need to introduce padding bytes to align the data properly in memory. 

I was expecting the compiler to reorder the fields such that data can be aligned while reducing the number of padding. 
However, the compiler didn’t do this even with `-O3` optimization enabled, which surprised me.

For context, processors operate on data in units of its word size. For example, 64 bits on a 64-bit CPU. Therefore, data must be properly aligned in memory. For instance, a 64-bit word can hold two 32-bit integers, but only if they are aligned correctly, starting at a memory address that is a multiple of their size. Proper alignment ensures that each data element resides at a memory location that is a multiple of its own size, which allows the CPU to access it efficiently. Improper alignment can cause the CPU to fetch the data multiple times in order to access the complete value. Additionally, the data may be split across cache lines, which can further reduce performance.

So, for our struct above, if we store the fields in the given order (char -> double -> int):
- The double must be 8-byte aligned, so we need to introduce 7 bytes of padding between char and double.
- Similarly, if we don’t add any padding after int, the next element in an array of this struct could have its double at a misaligned address. Therefore, we also need 4 bytes of padding at the end.

This brings the total size of the struct to 24 bytes.

I was expecting the compiler to reorder the fields automatically, for example, double -> int -> char, which would reduce padding and produce a more compact 16-byte struct. However, that didn't happen.

After investigating, I found that C strictly enforces the order of struct fields for ABI compatibility and memory-mapped I/O. This means it is up to the programmer to be mindful of alignment.

A common strategy to reduce padding seems to be to order struct fields from largest to smallest, which naturally produces a more compact memory layout. This can be a useful micro-optimization, especially when working with large arrays of such structs, since even a small reduction in padding can lead to more data fetched per memory access or better cache utilization.

If the struct is only being used to serialize data for I/O, padding can be wasteful. Fortunately, I found C compilers provide a way to disable padding using `#pragma pack`. 

For example:
```c
#pragma pack(push, 1)
struct AlignmentCheck {
    char c;
    double d;
    int a;
};
#pragma pack(pop)
```

This produces a struct of 13 bytes, completely eliminating internal padding. However, for computation, a properly padded struct must be constructed from deserilization.
