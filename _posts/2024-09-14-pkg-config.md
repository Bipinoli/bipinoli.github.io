---
layout: post
title: pkg-config
---
`pkg-config` is a tool that originated in Linux to view the meta information about installed libraries. It can be used to know things like: 
- include path of header files
- link path of library files
- version of library
- etc.

When a library is built or installed, usually a `.pc` meta file is produced. `.pc` file contains all meta information such as link path, etc. For `pkg-config` to work with the library, the `.pc` file must be placed in the correct search location.

## Example use
Say I want to use `libpng` to work with png images. I install `libpng` via say homebrew and now want to use it in my project as a library. How can I do that?

1. First let's see what version of `libpng` do I have \
   `$ pkg-config --modversion libpng` \
   `1.6.43`
   
2. Ok good. Where can I find the header files for `libpng` \
   `$ pkg-config --cflags libpng` \
   `-I/opt/local/include/libpng16 -I/opt/local/include`
   
3. Nice. What about the path of libraries to link? \
   `$ pkg-config --libs libpng` \
   `-L/opt/local/lib -lpng16`

With these information I can easily use the library with my project like: \
`gcc pngViewr.c -o pngViewr -I/opt/local/include/libpng16 -I/opt/local/include -L/opt/local/lib -lpng16`

or even better: \
`gcc pngViewr.c -o pngViewr $(pkg-config --libs -cflags libpng)`
   
   
   
