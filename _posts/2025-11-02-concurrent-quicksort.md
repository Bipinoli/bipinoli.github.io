---
layout: post
title: Concurrent quicksort algorithm with custom thread pool in C++
toc: true
---

While reading <i>C++ Concurrency in Action</i>, I got the idea of implementing a concurrent version of the quicksort algorithm. My plan was to create a pool of worker threads and use them to concurrently execute the recursive subtasks of the sort. [This is my implementation on GitHub](https://github.com/Bipinoli/Study-Lab/tree/main/quiksort_workers_multi_threaded). In this post, I want to document the idea and share my general thought process.


#### Step 1: Sequential quicksort algorithm
[Link to the sequential implementation](https://github.com/Bipinoli/Study-Lab/blob/main/quiksort_workers_multi_threaded/sequential.hpp)

The quicksort algorithm sorts numbers using the divide-and-conquer strategy. The idea is to choose a number in the array as a pivot and arrange the elements so that the numbers less than the pivot are on the left and the greater ones are on the right, thereby fixing the pivot’s final position in the array. After this, the subarrays on the left and right can follow the same process.

I realized I had never actually implemented quicksort before, and I was too proud to look up any examples, so it took me some time to figure out a good in-place solution for rearranging the numbers around the pivot. After [testing](https://github.com/Bipinoli/Study-Lab/blob/main/quiksort_workers_multi_threaded/test.hpp) the implementation with randomly generated arrays, I was satisfied with the results and moved on to the concurrent version.


#### Step 2: Concurrent quicksort algorithm
[Link to the concurrent implementation](https://github.com/Bipinoli/Study-Lab/blob/main/quiksort_workers_multi_threaded/concurrent.hpp)

The quicksort algorithm has a recursive structure like this:
```
sort: [n,n,n,n,n,n,n]
- choose pivot p & arrange numbers around it [s,s,s,p,p,b,b]
- sort smaller [s,s,s]
- sort bigger [b,b]
```
This shows the [tail-recursive](https://en.wikipedia.org/wiki/Tail_call) nature of the algorithm. After the arrangement step, the positions of the pivot elements are final. Therefore, we don’t need to know the results of the sub-tasks.

##### Worker system
So, the idea is quite simple. Let's set up a pool of worker threads. Each worker will fetch a task from the task queue. A task contains a reference to an array, along with the start and end indices to sort in place. The worker selects a pivot and arranges the numbers around it. After that, it creates the necessary sub-tasks and submits them back to the task queue, where they can be picked up by any available worker. In this way, multiple workers can concurrently sort different parts of the array. Since there’s no interdependency, we can even apply this to multiple arrays at once, i.e. a batch of arrays.

##### Knowing when sort has finished
It’s important to know when the sorting process has completed. Since each worker only handles a portion of the array, it doesn’t have enough information on its own to determine whether all sub-tasks are finished. To manage this, we maintain a count of all in-progress sub-tasks. Whenever a task is subdivided, the worker increments an atomic counter to reflect the creation of new sub-tasks. When there are no further sub-tasks to divide and the pivoting is complete, the worker decrements the in-progress counter and notifies the main thread. The main thread waits for this notification and checks the counter to determine whether all sub-tasks have finished.

Note that this counter-based scheme works because we don’t need to maintain a stack of sub-task statuses, thanks to the tail-recursive nature of the algorithm.


#### Step 3: Validation
I wanted to roughly validate that the concurrent implementation was working. To do this, I created a sufficiently large batch of arrays so that the thread overhead would be justified, and I could observe whether the concurrent version actually took less time. I generated a random batch of sort tasks and measured the execution time for each.

```
boli@Bipins-MBP quick_sort % ./build/main
main(62428,0x109480600) malloc: nano zone abandoned due to inability to preallocate reserved vm space.
Sequential quicksort test passed!
Concurrent quicksort test passed!
--------------------------------
Performance comparison between sequential quicksort and concurrent quicksort:
Sorting batch #0 with 5357214 numbers in total
Sorting completed by sequential quicksort in 17243 ms
Sorting completed by concurrent quicksort with 7 workers in 5434 ms
Sorting batch #1 with 4751498 numbers in total
Sorting completed by sequential quicksort in 19370 ms
Sorting completed by concurrent quicksort with 7 workers in 4616 ms
Sorting batch #2 with 5283119 numbers in total
Sorting completed by sequential quicksort in 17046 ms
Sorting completed by concurrent quicksort with 7 workers in 4736 ms
Sorting batch #3 with 5415888 numbers in total
Sorting completed by sequential quicksort in 17375 ms
Sorting completed by concurrent quicksort with 7 workers in 4728 ms
boli@Bipins-MBP quick_sort %
```

It would be nice to have some observability metrics to see exactly how busy the workers were with actual compute tasks. The total execution time seems excessively large for what the program does. However, the important thing is that concurrency does appear to bring performance benefits, which is what I wanted to confirm.

In the future, I’d like to explore Linux’s <i>perf</i> or try some eBPF-based tools for deeper analysis. The [perf wiki guide](https://perfwiki.github.io/main/) is already on my reading list, and it would be great to revisit here once I’ve gone through it.

For now, though, it’s time to continue with the other chapters of the book.

Thank you for reading. Adios!
