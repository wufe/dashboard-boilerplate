# The menu

## The hard ( too complex to be right ) way

For a matter of separation of concerns, I decided to use a tree-shaped structure for the menu state.  
Reselectors have been useful for creating an array of menu items out of the object in the state.  
A immutability-driven function called "apply" has been created to enable conditional update of an object state while reducing.  

The `withNavigation` (thanks to Mike Bridge) component has been used in order to use hoc for routing capabilities.  
It is documented [here](https://mikebridge.github.io/articles/getting-started-typescript-react-4/).