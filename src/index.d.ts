import Roact from "@rbxts/roact";

// Core Hooks
declare namespace RoactHooks {
	/**
	 *  Library's built-in hooks
	 */
	export interface CoreHooks {
		/** Used to store a stateful value. Returns the current value, and a function that can be used to set the value. */
		useState: <T>(defaultValue: BasicStateAction<T>) => LuaTuple<[Readonly<T>, Dispatch<BasicStateAction<T>>]>;
		/**
		 *  Used to perform a side-effect with a callback function.
		 *
		 *  This callback function can return a destructor. When the component unmounts, this function will be called.
		 *
		 *  You can also pass in a list of dependencies to `useEffect`. If passed, then only when those dependencies change will the callback function be re-ran.
		 */
		useEffect: (callback: () => (() => void) | void, dependencies?: any[]) => void;
		/** Returns the value of the [context](https://roblox.github.io/roact/advanced/context/). */
		useContext: <T>(context: RoactContext<T>) => T;
		/** 
		 *  Similar to [useRef in React](https://reactjs.org/docs/hooks-reference.html#useref).
		    Creates a table that you can mutate without re-rendering the component every time.
		    Think of it like a class variable (`this.something = 1` vs. `this.setState({ something: 1 })`).
		 */
		useValue: <T>(value?: T) => MutableValueObject<T>;
		/**
		 *  Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) callback.
		 *
		 *  `useCallback(callback, dependencies)` is equivalent to `useMemo(() => callback, dependencies)`.
		 */
		useCallback: <F extends (...args: any[]) => any>(callback: F, dependencies?: any[]) => F;
		/**
		 *  Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) value.
		 *
		 *  `useMemo` will only recalculate the inner value when the dependencies have changed.
		 *
		 *  The function passed to `useMemo` runs during rendering, so don't perform any side effects.
		 */
		useMemo: <T>(createValue: () => T, dependencies?: any[]) => T;
		/**
		 *  Returns a [memoized](https://en.wikipedia.org/wiki/Memoization) [binding](https://roblox.github.io/roact/advanced/bindings-and-refs/#bindings).
		 *
		 *  These can then be used just like normal bindings in Roact.
		 */
		useBinding: <T>(defaultValue: T) => LuaTuple<[Roact.Binding<T>, (newValue: T) => void]>;
		/**
		 *  An alternative to `useState` that uses a reducer rather than state directly.
		    If you’re familiar with Rodux, you already know how this works.
		 */
		useReducer: <S = {}, A extends Action = Action>(
			reducer: Reducer<S, A>,
			initialState: S
		) => LuaTuple<[S, Dispatch<A>]>;
		/**
		 * The roact version the library uses. This is useful if custom hooks need direct access to Roact.
		 */
		Roact: typeof Roact;
	}
}

// Utility Types
declare namespace RoactHooks {
	/**
	 *  Type of the component
	 */
	export type ComponentType =
		| "Component"
		| "PureComponent";
	/**
	 *  A basic state action.
	 *  Returns its state type or a callback that returns it, using the same as the parameter type.
	 * 
	 *  Used in `useState`
	 */
	export type BasicStateAction<S> = S | ((currentValue: S) => S);
	/**
	 *  Generic type for dispatching state actions
	 */
	export type Dispatch<A> = (action: A) => void;
	/**
	 *  A Function Component
	 */
	export type FC<P = {}> = (props: Roact.PropsWithChildren<Readonly<P>>, hooks: CoreHooks) => Roact.Element;
	/**
	 *  A reducer
	 */
	export type Reducer<S = {}, A extends Action = Action> = (state: S, action: A) => S;
	/**
	 *  Extracts the props type from a Function Component
	 */
	export type InferFCProps<T> = T extends FC<infer P> ? P : never;
	/**
	 *  An empty props type
	 */
	export type NoProps = {
		/** @hidden */
		readonly _nominal_NoProps: unique symbol;
	};
	/**
	 *  Make K properties in T optional
	 */
	export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
	/**
	 *  A utility type to provide an error message for props validation
	 */
	export type PropsValidationWithMessage = LuaTuple<[false, string]> | LuaTuple<[true, never]>;
	/**
	 *  A utility type for mutable tables.
	 * 
	 *  Used in `useValue`
	 */
	export interface MutableValueObject<T> {
		value: T;
	}
	/**
	 *  Return type from [Roact.createContext](https://roblox.github.io/roact/api-reference/#roactcreatecontext).
	 */
	export interface RoactContext<T> {
		Provider: Roact.ComponentConstructor<{
			value: T;
		}>;
		Consumer: Roact.ComponentConstructor<{
			render: (value: T) => Roact.Element | undefined;
		}>;
	}
	/**
	 *  An action type for reducers
	 */
	export interface Action<T = string> {
		type: T;
	}
}

// Constructor
declare namespace RoactHooks {
	export interface Hooks {
		/**
		 *  It is required you pass in the Roact you are using, since you can't combine multiple versions of Roact together.
		 * 
		 *  Returns a function that can be used to create a new Roact component with hooks.
		 *  An optional dictionary can be passed in. The following are the valid keys that can be used, and what they do.
		 */
		new (roact: typeof Roact): <
			F extends FC<any>,
			P extends Partial<InferFCProps<F>> | undefined
		>(
			render: F,
			options?: Partial<{
				/**
				 *  Refers to the name used in debugging. If it is not passed, it'll use the function name of what was passed in.
	 			 *  For instance, `new Hooks(Roact)(Component)` will have the component name `"Component"`.
				 */
				name: string;
				/**
				 *  Defines default values for props to ensure props will have values even if they were not specified by the parent component.
				 */
				defaultProps: P;
				/**
				 *  Defines if the component will be either a `Component` or a `PureComponent`.
				 * 
				 *  See [Component Types](https://roblox.github.io/roact/api-reference/#component-types) for reference.
				 */
				componentType: ComponentType;
				/**
				 *  Provides a mechanism for verifying inputs passed into the component.
				 */
				validateProps: (props: InferFCProps<F>) => boolean | PropsValidationWithMessage;
			}>
		) => (
			props: keyof P extends never
				? InferFCProps<F>
				: P extends undefined
				? InferFCProps<F>
				: keyof P extends defined
				? Optional<InferFCProps<F>, keyof P>
				: InferFCProps<F>
		) => Roact.Element;
	}
}

// Deprecated
declare namespace RoactHooks {
	/** @deprecated Use `CoreHooks` instead. */
	export type HookFunctions = RoactHooks.CoreHooks;
}

declare const RoactHooks: RoactHooks.Hooks;

export = RoactHooks;
