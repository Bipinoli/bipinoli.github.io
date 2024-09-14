## About pkg-config
`pkg-config` is a tool that originated in Linux to view the meta information about installed libraries. It can be very useful to know the following about the install libraries:
- header files include path
- link path of library files
- version of library
- etc.

When a library is built or installed, if it produces a `.pc` file than it works with `pkg-config`. `.pc` file has all the meta-information needed. After putting these `.pc` files in the folder where `pkg-config` looks for them it should work just fine.

## Example use
Say you want to use `libpng` to work with png images. You install `libpng` via say homebrew and now want to use it in your project as a library. How would you do it?

1. First let's see what version of `libpng` we have \
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
   
   
   
