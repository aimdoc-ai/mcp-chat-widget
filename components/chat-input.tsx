"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTextareaResize } from "@/hooks/use-textarea-resize";
import { ArrowUpIcon, CornerDownLeft, CornerRightUp, Mic, MicOff } from "lucide-react";
import type React from "react";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

// Add SpeechRecognition type declarations
interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
	resultIndex: number;
}

interface SpeechRecognitionResultList {
	readonly length: number;
	[index: number]: SpeechRecognitionResult;
	item(index: number): SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
	readonly length: number;
	[index: number]: SpeechRecognitionAlternative;
	item(index: number): SpeechRecognitionAlternative;
	isFinal: boolean;
}

interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

/**
 * Error event that occurs during speech recognition
 */
interface SpeechRecognitionErrorEvent extends Event {
	error: SpeechRecognitionErrorCode;
	message: string;
}

/**
 * Error codes for speech recognition
 */
type SpeechRecognitionErrorCode = 
	| 'aborted'          // Speech recognition was aborted
	| 'audio-capture'    // Audio capture failed
	| 'bad-grammar'      // Grammar compilation failed
	| 'language-not-supported' // Language not supported
	| 'network'          // Network communication failed
	| 'no-speech'        // No speech detected
	| 'not-allowed'      // User denied permission
	| 'service-not-allowed' // Service not allowed
	| 'other';           // Other errors

interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	start(): void;
	stop(): void;
	abort(): void;
	onresult: (event: SpeechRecognitionEvent) => void;
	onerror: (event: SpeechRecognitionErrorEvent) => void;
	onstart: () => void;
	onend: () => void;
}

// Add global declarations
declare global {
	interface Window {
		SpeechRecognition: new () => SpeechRecognition;
		webkitSpeechRecognition: new () => SpeechRecognition;
	}
}

interface ChatInputContextValue {
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onSubmit?: () => void;
	loading?: boolean;
	onStop?: () => void;
	variant?: "default" | "unstyled";
	rows?: number;
	setInputValue?: (value: string) => void;
}

const ChatInputContext = createContext<ChatInputContextValue>({});

interface ChatInputProps extends Omit<ChatInputContextValue, "variant"> {
	children: React.ReactNode;
	className?: string;
	variant?: "default" | "unstyled";
	rows?: number;
	setInputValue?: (value: string) => void;
}

function ChatInput({
	children,
	className,
	variant = "default",
	value,
	onChange,
	onSubmit,
	loading,
	onStop,
	rows = 1,
	setInputValue,
}: ChatInputProps) {
	const contextValue: ChatInputContextValue = {
		value,
		onChange,
		onSubmit,
		loading,
		onStop,
		variant,
		rows,
		setInputValue,
	};

	return (
		<ChatInputContext.Provider value={contextValue}>
			<div
				className={cn(
					variant === "default" &&
						"flex flex-col items-end w-full p-2 rounded-lg border border-input bg-transparent focus-within:ring-1 focus-within:ring-ring focus-within:outline-none",
					variant === "unstyled" && "flex items-start gap-2 w-full",
					className,
				)}
			>
				{children}
			</div>
		</ChatInputContext.Provider>
	);
}

ChatInput.displayName = "ChatInput";

interface ChatInputTextAreaProps extends React.ComponentProps<typeof Textarea> {
	value?: string;
	onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
	onSubmit?: () => void;
	variant?: "default" | "unstyled";
}

function ChatInputTextArea({
	onSubmit: onSubmitProp,
	value: valueProp,
	onChange: onChangeProp,
	className,
	variant: variantProp,
	...props
}: ChatInputTextAreaProps) {
	const context = useContext(ChatInputContext);
	const value = valueProp ?? context.value ?? "";
	const onChange = onChangeProp ?? context.onChange;
	const onSubmit = onSubmitProp ?? context.onSubmit;
	const rows = context.rows ?? 1;

	// Convert parent variant to textarea variant unless explicitly overridden
	const variant =
		variantProp ?? (context.variant === "default" ? "unstyled" : "default");

	const textareaRef = useTextareaResize(value, rows);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (!onSubmit) {
			return;
		}
		if (e.key === "Enter" && !e.shiftKey) {
			if (typeof value !== "string" || value.trim().length === 0) {
				return;
			}
			e.preventDefault();
			onSubmit();
		}
	};

	return (
		<Textarea
			ref={textareaRef}
			{...props}
			value={value}
			onChange={onChange}
			onKeyDown={handleKeyDown}
			className={cn(
				"max-h-[400px] min-h-0 resize-none overflow-x-hidden",
				variant === "unstyled" &&
					"border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none",
				className,
			)}
			rows={rows}
		/>
	);
}

ChatInputTextArea.displayName = "ChatInputTextArea";

interface ChatInputSubmitProps extends React.ComponentProps<typeof Button> {
	onSubmit?: () => void;
	loading?: boolean;
	onStop?: () => void;
}

function ChatInputSubmit({
	onSubmit: onSubmitProp,
	loading: loadingProp,
	onStop: onStopProp,
	className,
	...props
}: ChatInputSubmitProps) {
	const context = useContext(ChatInputContext);
	const loading = loadingProp ?? context.loading;
	const onStop = onStopProp ?? context.onStop;
	const onSubmit = onSubmitProp ?? context.onSubmit;

	if (loading && onStop) {
		return (
			<Button
				onClick={onStop}
				className={cn(
					"shrink-0 rounded-full p-1.5 h-fit border dark:border-zinc-600",
					className,
				)}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-label="Stop"
				>
					<title>Stop</title>
					<rect x="6" y="6" width="12" height="12" />
				</svg>
			</Button>
		);
	}

	const isDisabled =
		typeof context.value !== "string" || context.value.trim().length === 0;

	return (
		<Button
			className={cn(
				"shrink-0 rounded-full p-1.5 h-fit border dark:border-zinc-600",
				className,
			)}
			disabled={isDisabled}
			onClick={(event) => {
				event.preventDefault();
				if (!isDisabled) {
					onSubmit?.();
				}
			}}
			{...props}
		>
			<CornerDownLeft />
		</Button>
	);
}

ChatInputSubmit.displayName = "ChatInputSubmit";

interface ChatInputMicProps extends React.ComponentProps<typeof Button> {
	setInputValue?: (value: string) => void;
	className?: string;
}

function ChatInputMic({
	setInputValue: setInputValueProp,
	className,
	...props
}: ChatInputMicProps) {
	const context = useContext(ChatInputContext);
	const [isListening, setIsListening] = useState(false);
	const [isSpeechSupported, setIsSpeechSupported] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showErrorTooltip, setShowErrorTooltip] = useState(false);
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	
	// Get the current input value to append new speech
	const currentValue = context.value || '';
	const setInputValue = setInputValueProp || context.setInputValue;
	
	// Check if speech recognition is supported
	useEffect(() => {
		const isBrowser = typeof window !== 'undefined';
		
		// Check if SpeechRecognition is available
		const hasSpeechRecognition = isBrowser && (
			'SpeechRecognition' in window || 
			'webkitSpeechRecognition' in window
		);
		
		// Additional browser-specific checks
		const isChrome = isBrowser && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
		const isEdge = isBrowser && /Edg/.test(navigator.userAgent);
		const isSafari = isBrowser && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
		const isFirefox = isBrowser && /Firefox/.test(navigator.userAgent);
		
		// Set supported state
		const isSupported = hasSpeechRecognition && (isChrome || isEdge || isSafari);
		
		if (hasSpeechRecognition && !isSupported) {
			// For Firefox, it has SpeechRecognition but is not fully supported
			console.warn('Speech recognition may not be fully supported in this browser.');
			
			// Still set to true if it's available, even with potential issues
			setIsSpeechSupported(hasSpeechRecognition);
		} else {
			setIsSpeechSupported(isSupported);
		}
	}, []);
	
	// Initialize speech recognition
	useEffect(() => {
		if (typeof window === 'undefined') return;
		
		const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (!SpeechRecognitionConstructor) return;
		
		const recognition = new SpeechRecognitionConstructor();
		recognition.continuous = true;
		recognition.interimResults = true;
		recognition.lang = 'en-US';
		
		recognition.onresult = (event: SpeechRecognitionEvent) => {
			let finalTranscript = '';
			let interimTranscript = '';
			
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript;
				
				if (event.results[i].isFinal) {
					finalTranscript += transcript;
				} else {
					interimTranscript += transcript;
				}
			}
			
			if (!setInputValue) return;
			
			// Update the input value to include both the current input and the interim transcript
			// For final transcript, we append it to the current value permanently
			if (finalTranscript) {
				const newValue = ((currentValue || '') + ' ' + finalTranscript).trim();
				setInputValue(newValue);
			}
			
			// For interim transcript, we show it directly in the input field but in a temporary way
			// This will be replaced when the final transcript comes in or removed when recognition stops
			if (interimTranscript) {
				// If we have both permanent text and interim, combine them
				if (currentValue) {
					setInputValue(currentValue + ' ' + interimTranscript);
				} else {
					setInputValue(interimTranscript);
				}
			}
		};
		
		recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
			console.error('Speech recognition error', event);
			
			// Handle specific error types
			let errorMsg = 'Speech recognition error';
			
			switch (event.error) {
				case 'not-allowed':
					errorMsg = 'Microphone access denied. Please allow microphone access in your browser settings.';
					break;
				case 'audio-capture':
					errorMsg = 'No microphone detected or microphone is not working properly.';
					break;
				case 'no-speech':
					errorMsg = 'No speech detected. Please try again.';
					break;
				case 'network':
					errorMsg = 'Network error occurred. Please check your internet connection.';
					break;
				case 'aborted':
					errorMsg = 'Speech recognition was aborted.';
					break;
				case 'language-not-supported':
					errorMsg = 'The language is not supported.';
					break;
				default:
					errorMsg = `Speech recognition error: ${event.error || 'unknown'}`;
			}
			
			setErrorMessage(errorMsg);
			setShowErrorTooltip(true);
			setIsListening(false);
			
			// Auto-hide the error tooltip after 5 seconds
			if (errorTimeoutRef.current) {
				clearTimeout(errorTimeoutRef.current);
			}
			errorTimeoutRef.current = setTimeout(() => {
				setShowErrorTooltip(false);
			}, 5000);
		};
		
		recognition.onend = () => {
			console.log("Speech recognition ended");
			setIsListening(false);
			
			// When recognition ends, ensure we're only showing the permanent text
			// This removes any interim transcript from the input field
			if (setInputValue && currentValue) {
				setInputValue(currentValue);
			}
		};
		
		recognitionRef.current = recognition;
		
		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (error) {
					console.error('Error stopping speech recognition during cleanup:', error);
				}
			}
			
			// Clear any pending timeouts
			if (errorTimeoutRef.current) {
				clearTimeout(errorTimeoutRef.current);
			}
		};
	}, [currentValue, setInputValue]);
	
	// Toggle speech recognition
	const toggleSpeechRecognition = useCallback(() => {
		// Clear any previous error
		setErrorMessage(null);
		setShowErrorTooltip(false);
		
		// Clear any existing error timeout
		if (errorTimeoutRef.current) {
			clearTimeout(errorTimeoutRef.current);
			errorTimeoutRef.current = null;
		}
		
		if (!recognitionRef.current) {
			setErrorMessage('Speech recognition not initialized. Please refresh the page.');
			setShowErrorTooltip(true);
			return;
		}
		
		if (isListening) {
			try {
				// Some browsers might throw "invalid state" errors when stopping, especially
				// if the recognition has already ended automatically
				recognitionRef.current.stop();
				
				// When stopping, make sure we only keep the permanent text
				if (setInputValue && currentValue) {
					setInputValue(currentValue);
				}
			} catch (error) {
				console.error('Error stopping speech recognition:', error);
				// If there's an error stopping, we should still clean up
			} finally {
				setIsListening(false);
			}
		} else {
			try {
				// Save the current input as our base value before we start recording
				// This ensures we know what was typed vs what is from speech
				if (context.value) {
					// Store the current input value before we start recording
					// as our reference point for permanent text
				}
				
				recognitionRef.current.start();
				setIsListening(true);
			} catch (error) {
				console.error('Failed to start speech recognition:', error);
				
				// More specific error handling
				let errorMsg = 'Failed to start speech recognition. Please try again.';
				
				// Handle DOMException errors which are common with SpeechRecognition
				if (error instanceof DOMException) {
					switch (error.name) {
						case 'NotAllowedError':
							errorMsg = 'Microphone access denied. Please allow microphone access in your browser settings.';
							break;
						case 'AbortError':
							errorMsg = 'Speech recognition was aborted unexpectedly.';
							break;
						case 'NotSupportedError':
							errorMsg = 'Speech recognition is not supported in this browser.';
							break;
					}
				}
				
				setErrorMessage(errorMsg);
				setShowErrorTooltip(true);
				setIsListening(false);
				
				// Auto-hide the error tooltip after 5 seconds
				errorTimeoutRef.current = setTimeout(() => {
					setShowErrorTooltip(false);
				}, 5000);
			}
		}
	}, [isListening, currentValue, setInputValue, context.value]);
	
	// Mouse enter/leave handlers for the error tooltip
	const handleMouseEnter = useCallback(() => {
		if (errorMessage) {
			setShowErrorTooltip(true);
			
			// Clear any existing timeout when hovering
			if (errorTimeoutRef.current) {
				clearTimeout(errorTimeoutRef.current);
				errorTimeoutRef.current = null;
			}
		}
	}, [errorMessage]);
	
	const handleMouseLeave = useCallback(() => {
		// Set timeout to hide tooltip after a delay
		if (errorMessage) {
			errorTimeoutRef.current = setTimeout(() => {
				setShowErrorTooltip(false);
			}, 1000);
		}
	}, [errorMessage]);
	
	// If speech recognition is not supported, don't render the button
	if (!isSpeechSupported) {
		return null;
	}
	
	// Show error as a tooltip on hover if there's an error
	return (
		<div 
			className="relative" 
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{showErrorTooltip && errorMessage && (
				<div className="absolute bottom-full mb-2 p-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-xs rounded-md w-48 shadow-md z-50">
					{errorMessage}
				</div>
			)}
			<Button
				className={cn(
					"shrink-0 rounded-full p-1.5 h-fit",
					isListening && "bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600",
					errorMessage && "border-red-500",
					className,
				)}
				variant="ghost"
				onClick={toggleSpeechRecognition}
				title={isListening ? "Stop listening" : errorMessage || "Start voice input"}
				{...props}
			>
				{isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
			</Button>
		</div>
	);
}

ChatInputMic.displayName = "ChatInputMic";

export { ChatInput, ChatInputTextArea, ChatInputSubmit, ChatInputMic };
