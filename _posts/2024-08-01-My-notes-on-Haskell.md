---
layout: post
title: My notes on Haskell
toc: true
---

#### Let and where
```
module Main where 

-- let 
diff :: Integer -> Integer -> Integer
diff a b = let firstSmall = a < b 
               difference = a - b
              in 
                if firstSmall then - difference else difference


-- where 
diff2 :: Integer -> Integer -> Integer
diff2 a b = if firstSmall then - difference else difference
           where 
             firstSmall = a < b
             difference = a - b



main :: IO ()
-- main = print (diff 3 2)
main = print (diff 2 3)
```

#### Haskell has no loop
```
-- Recursion and guards
factorial :: Integer -> Integer
factorial n
    | n <= 1 = 1
    | otherwise = n * factorial (n - 1)


-- Tail recursive way
-- Note: tail recursive functions can be replaced by while loop thus avoiding potential stackoverflow
fact :: Integer -> Integer
fact n = accumulator n 1 
        where 
            accumulator n total 
                | n <= 1 = total 
                | otherwise = accumulator (n-1) (n * total)
```

#### Parametric polymorphism & list comprehension
```
-- Cross product of lists with generic datatype
cross :: [a] -> [b] -> [(a, b)]
cross x y = [(i, j) | i <- x, j <- y]


-- Remove duplicates from the list
-- Parametric datatype a with Eq typeclass constraint
existsIn :: (Eq a) => a -> [a] -> Bool
existsIn _ [] = False 
existsIn a (x:xs) = (a == x) || (a `existsIn` xs)

removeDuplicates :: (Eq a) => [a] -> [a]
removeDuplicates [] = []
removeDuplicates (x:xs)
    | x `existsIn` xs = removeDuplicates xs
    | otherwise = x : removeDuplicates xs
```

#### Challenge: graph traversal
```
-- Create a function 'hasPath' that determines
-- if a path from one node to another exists in the directed graph.

-- Graph is a list of edges where edge is a pair of nodes which indicates 
-- and existence of path from the first to the second.
-- Eg. in a graph [(1,2), (2,3)], there are directed edges from 1 to 2 and 2 to 3

hasPath :: [(Int, Int)] -> Int -> Int -> Bool
hasPath [] src dest = src == dest
hasPath xs src dest 
    | src == dest = True
    | otherwise = let connectingEdges = [(a,b) | (a,b) <- xs, a /= src]
                  in or [hasPath connectingEdges b dest | (a, b) <- xs, a == src]
```

#### High-order functions & lambda
```
filter (\(x,y) -> x > y) [(1,2), (2,3), (4,2), (2,1)]
map (\x -> -x) [1,2,3]
foldl (\acc elem -> acc + elem) 0 [1,2,3,4,5]
```

#### Currying & composition
```
adder :: Int -> Int -> Int 
adder x y = x + y

-- composition of partial functions
result = adder 2 ((adder 2 . adder 1) 4)

-- dollar sign syntatic-sugar
result2 = adder 2 $ adder 2 . adder 1 $ 4
```

#### Challenge: find prefixes
```
-- a function that returns all the prefixes of the list
-- eg: FindPrefixes [1,2,3] = [[1], [1,2], [1,2,3]]
findPrefixes :: [a] -> [[a]]
findPrefixes = foldr (\x acc -> [x] : (map (\sublst -> x : sublst) acc)) []
```

#### Challenge: Preorder traversal of Trie
```
module Main where 

data Trie a = Leaf a | Node a [Trie a]

preorderTraversal :: Trie a -> [a]
preorderTraversal (Leaf a) = [a]
preorderTraversal (Node a children) = 
    a : foldl (\acc c -> acc ++ preorderTraversal c) [] children

-- Trie
--   c
--   |-> a
--   |   |->  r
--   |   |->  t
--   |-> o
--       |->  o
--            |-> l  

trie = Node 'c' [
    Node 'a' [
        Leaf 'r',
        Leaf 't'
    ],
    Node 'o' [
        Node 'o' [
            Leaf 'n'
        ]
    ]]

main :: IO ()
main = print $ preorderTraversal trie
```

#### Records
```
module Main where

data Person = Person { name :: String, age :: Int }

greet :: Person -> [Char]
greet (Person name _) = "Hi, " ++ name

main :: IO ()
main = print $ greet Person { name = "Bipin", age = 23}
```

#### Typeclass is like interface
```
-- declaring typeclass
class Animal a where 
    canWalk :: a -> Bool
    speak :: a -> String

-- instance of typeclass for a type
data Dog = Dog { dogName :: String}
instance Animal Dog where 
    canWalk _ = True
    speak (Dog dogName) = "I am " ++ dogName ++ ". woof!!"

-- deriving typeclass Show (implemented based on type of fields)
data Crow = Crow { birdName :: String }
    deriving (Show)
instance Animal Crow where 
    canWalk _ = False
    speak (Crow birdName) = "I am " ++ birdName ++ ". Caw! Caw!" 

crow = Crow { birdName = "Mr. Crow"}

main :: IO ()
main = print $ show crow ++ " says " ++ speak crow
```

#### IO Action
```
-- IO action, not a function as it interacts with environment
-- do -> for sequential step by step work
-- Evaluates to no expression so () type
main :: IO ()
main = do 
    inpt <- getLine
    if inpt /= "exit" then do
        putStrLn $ "input: " ++ inpt
        main
    else 
        return ()
```

```
printInBetween :: [Int] -> IO ()
printInBetween (x:[]) = return ()
printInBetween (x:y:[]) = do 
    putStrLn $ show x
    if x < y then printInBetween $ (x+1) : [y]
    else return ()

main :: IO ()
main = do 
    putStrLn "Enter two integers separated by space."
    putStrLn "I will give you numbers in between."
    nums <- getLine
    let numbers = map read $ words nums :: [Int]
    printInBetween numbers
```

#### Monad
Monad is a box that can hold a value. It has a bind function (>>=) that can be used to chain the monads together. When the value exists the bind function take the inner value and returns another monad. Otherwise it returns the fail case and the flow won't go to the next item in the chain. 

This is a very useful pattern to deal with exceptions, asynchronous operation eg. Promise, mutation of environment (IO actions), etc.

```
module Main where 

import Control.Applicative
import Control.Monad (liftM, ap)

-- New Monad type
data MyMaybe a = Value a | NoValue
    deriving (Show)

-- This is needed for all monads 
instance Functor MyMaybe where
  fmap = liftM
instance Applicative MyMaybe where
  pure  = return
  (<*>) = ap

-- implementing Monad typeclass 
--    (>>=) is a bind function
instance Monad MyMaybe where 
    (>>=) :: MyMaybe a -> (a -> MyMaybe b) -> MyMaybe b
    ma >>= func = case ma of
                    Value a -> func a
                    NoValue -> NoValue
    return a = Value a

-- example of chaining 
addMonads :: Num a => MyMaybe a -> MyMaybe a -> MyMaybe a
addMonads ma mb = ma >>= (\a -> mb >>= (\b -> return $ a + b))

-- do notation does the same but more readable
-- if at any point the value is NoValue 
--     the function returns immediately with NoValue
addMonads2 :: Num a => MyMaybe a -> MyMaybe a -> MyMaybe a
addMonads2 ma mb = do 
    a <- ma
    b <- mb
    return $ a + b

x = Value 12
y = Value 23

main :: IO ()
main = print $ addMonads2 x y
```

#### Functor: fmap, <$>
```
module Main where 

-- functor is a pattern with a function 
-- that maps the internal value without changing the structure
data Tree a = Leaf a | Node a (Tree a) (Tree a)
    deriving (Show)

instance Functor Tree where 
    fmap::(a->b) -> Tree a -> Tree b
    fmap func (Leaf a) = Leaf $ func a
    fmap func (Node a left right) = 
      Node (func a) (fmap func left) (fmap func right)

tree = Node 1 (Node 2 (Leaf 3) (Node 4 (Leaf 5) (Leaf 6))) (Leaf 7)
treeMapped = fmap (\x -> -x) tree

-- <$> is a symbol for `fmap`
anotherMapped = (*(-10)) <$> tree

main :: IO ()
main = do
    print treeMapped 
    print anotherMapped

-- program output:
Node (-1) (Node (-2) (Leaf (-3)) (Node (-4) (Leaf (-5)) (Leaf (-6)))) (Leaf (-7))
Node (-10) (Node (-20) (Leaf (-30)) (Node (-40) (Leaf (-50)) (Leaf (-60)))) (Leaf (-70))
```

#### Applicative Functor: <\*>, pure

Applicative is a typeclass the represents a function inside a container.  It provides a functions `pure` and `<*>`. `pure` takes a function and wraps around the container. `<*>` takes a Applicative and a value in a container and produces a container with a function applied to the value.

```
module Main where

containerOfComputation:: Maybe (Integer -> Integer)
containerOfComputation = Just (*2)

containerOfValue:: Maybe Integer
containerOfValue = Just 10

main :: IO()
main = print ()

-- program output
ghci> containerOfComputation <*> containerOfValue
Just 20
ghci> 
ghci> Nothing <*> Just 2
Nothing
ghci> Just (*2) <*> Nothing
Nothing
```

```
module Main where

add1 :: Integer -> Integer -> Integer
add1 x y = x + y

add2 :: Maybe (Integer -> Integer -> Integer)
add2 = Just add1

main :: IO ()
main = do 
    print $ add2 <*> Just 10 <*> Just 20
    -- "pure add" wraps the function in the container
    print $ pure add1 <*> Just 10 <*> Just 20

-- program output
Just 30
Just 30
```
#### Challenge: Infinite fibonacci with DP 

Haskell being a lazy language allows infinite data structures.
```
module Main where 

fibo = 0 : 1 : zipWith (+) fibo (tail fibo)

main :: IO ()
main = print $ take 10 fibo
```

#### Strictness: thunks, seq, deepseq

Haskell is a lazy language. It doesn't execute the expression until it needs to. It keeps track of the unevaluated expressions as graph called thunks. Haskell function doesn't evaluate the function parameters before applying the function. It creates a new expression (thunk) for the result of the function with the inputs which are other thunks (parameters). This is how the thunk graph is built. Since functions are pure in Haskell, the function expression is evaluated only once and the memoized result is shared. So the dependencies get merged into a single shared thunk thereby the evaluation tree gets converted into a directed graph with shared node. I.e thunk is a computation graph that is yet to be completely evaluated.

However, sometimes the thunk graph can build up and take huge memory and the performance is impacted due to this overhead. In such cases evaluating the thunk early can be desirable.

Haskell has a function called `seq:: a -> b -> b`. The behaviour of the function is enforced in Haskell compiler to evaluate `a` to [weak head normal form](https://wiki.haskell.org/Weak_head_normal_form) before running `b`. In other words, `a` will be partially evaluated before running b. This provides a way of strictness in Haskell. Many common functions such as `foldl` have strict versions (`foldl'`) that use `seq` internally.

Haskell also provides a way to completely evaluate `a` before `b` called `deepseq`. It is in the module `Control.DeepSeq`. Complete evaluation of thunk is needed in situations such as when you are reading a file from the disk in an IO action. You want to get all contents from file, close the file and return contents from the IO action without keeping the unevaluated thunk with file cursor.

It is important to note that Haskell compiler can lose some type information on strict evaluation of thunk. Haskell compiler also does strictness analysis when the `-O` flag is set during compilation.

```
ghci> x = [1..10] :: [Int]
ghci> :sp x
x = _
ghci> seq x ()
()
ghci> :sp x
x = 1 : _
ghci> 
ghci> import Control.DeepSeq (deepseq)
ghci> deepseq x ()
()
ghci> :sp x
x = [1,2,3,4,5,6,7,8,9,10]
ghci> 
```

#### GADT
Generalised Algebraic Datatype (GADT) is a language extension to Haskell that improves the normal Algebraic Datatype of Haskell by including type checking in the data constructor. 

For example with a normal ADT:
```
data Expr = IntLit Int | 
             BoolLit Bool | 
             Add Expr Expr 
          deriving (Show)
          
main :: IO ()
main = do 
  print $ Add (BoolLit True) (IntLit 2)
```

Here we can create an expression that adds boolean and int literals. It would be nice to enforce the exact type of expression that could be added, and this is exactly what GADT provides.

With GADT:
```
{-# LANGUAGE GADTs #-}

data Expr a where
  IntLit :: Int -> Expr Int
  BoolLit :: Bool -> Expr Bool
  Add :: Expr Int -> Expr Int -> Expr Int
deriving instance (Show a) => Show (Expr a)
  
main :: IO()
main = do
  print $ Add (BoolLit True) (IntLit 2)
```
would give a compile time error as the Add expression can only work with two Int expressions.

#### Haskell Extensions
##### Type Family
Type family is similar to a function but it works on types instead of data. It allows us to associate many types with a common interface.
```
type family Bitsize a :: Nat

Explanation:
Bitsize is a type family that takes in a type 'a' and gives us a 'Nat' i.e Natual number type
```
