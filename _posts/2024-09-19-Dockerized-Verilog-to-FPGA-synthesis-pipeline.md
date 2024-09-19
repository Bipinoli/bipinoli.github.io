---
layout: post
title: Dockerized FPGA synthesis pipeline
---

![image](/assets/images/verilog2Fpga/fpga.png){:height="200px"}

I have been playing with Haskell and lately the [Clash hardware compiler](https://clash-lang.org/Clash). Clash transpiles the functional hardware description written in Haskell to the standard HDLs such as Verilog. To be able to run such verilog code in an FPGA, a bitstream needs to be generated to program the FPGA. This post talks about a dockerized pipeline called [Verilog2Fpga](https://github.com/Bipinoli/verilog2fpga) to do that. 

### Synthesis pipeline
[Verilog2Fpga](https://github.com/Bipinoli/verilog2fpga) uses the existing open-source synthesis tools. It currently programs the iCE40HX1K-BLINK-EVN FPGA as that's the one I happen to have.

1. [yosys](https://github.com/cliffordwolf/yosys) - to synthesize circult netlist from the HDL
2. [nextpnr](https://github.com/YosysHQ/nextpnr) - for placing and routing of circuit components for the FPGA
3. [icestorm](https://github.com/cliffordwolf/icestorm/) - to create a bitstream file with [icepack](https://github.com/cliffordwolf/icestorm/) for Lattice iCE40 FPGA
4. [icedude](https://github.com/reactive-systems/icedude) - to program the iCE40 evaluation board with the produced bitstream

### How to use?

#### Linux
1. Connect the FPGA via usb
2. Setup docker container with `./setup_container.sh`
3. Run `./synthesize.sh` with a path to your verilog files (.v, .pcf) as an argument. <br>
    Eg: `./synthesize.sh example_verilog`

#### macOS / Windows
On macOS and Windows, the docker runs within a separate VM, so unlike linux, it can't natively access the usb device. There are many ways this could be handled. Such as: 
- Configuring the VM where docker runs 
- Using tools like [socat](https://linux.die.net/man/1/socat) to forward usb data via TCP socket 

##### How I configured for macOS
I use Mac so I faced this issue myself. I chose to install a separate linux VM (debian) with virtualbox instead of configuring with the above mentioned methods, mainly for ease. This is how I configured VM 

###### 1. Identify the usb device
- I ran `ioreg -p IOUSB` in macOS which gave me the list of connected usb devices
- To identify the acutal name of the device, I disconnected the FPGA and ran the command again. The device which disappeared from the list is sure to be the the FPGA device

![image](/assets/images/verilog2Fpga/list_of_usb.png){:height="300px"} 

###### 2. Configure the VM to access the identified USB device
With the device name known, I put it in the usb device filters of VM setting. Alternatively, I could have passed through all the usb devices but this gave me more confidence.

![image](/assets/images/verilog2Fpga/configure_vm.png){:height="300px"} 

When the VM was running, I quickly ran `lsusb` to verify if it can access the usb device.

##### Running
After installing docker in the VM. I simply did:
1. `./setup_container.sh`
2. `./synthesize.sh example_verilog`

and that was it.




##### References
- https://github.com/reactive-systems/KitchenTimer/blob/master/clash/makefile
