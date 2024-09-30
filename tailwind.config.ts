import type { Config } from "tailwindcss";
const { fontFamily } = require("tailwindcss/defaultTheme");
const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {

  			shake1: {
  				'0%, 100%': {
  					transform: 'translate(0, 0)'
  				},
  				'10%, 30%, 50%, 70%, 90%': {
  					transform: 'translate(-2px, -1px)'
  				},
  				'20%, 40%, 60%, 80%': {
  					transform: 'translate(2px, 1px)'
  				}
  			},
  			shake2: {
  				'0%, 100%': {
  					transform: 'translate(0, 0)'
  				},
  				'10%, 30%, 50%, 70%, 90%': {
  					transform: 'translate(-1.5px, 1px)'
  				},
  				'20%, 40%, 60%, 80%': {
  					transform: 'translate(1.5px, -1px)'
  				}
  			},
  			shake3: {
  				'0%, 100%': {
  					transform: 'translate(0, 0)'
  				},
  				'10%, 30%, 50%, 70%, 90%': {
  					transform: 'translate(-2px, 0.5px)'
  				},
  				'20%, 40%, 60%, 80%': {
  					transform: 'translate(2px, -0.5px)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			shake1: 'shake1 1.5s ease-in-out infinite',
			shake2: 'shake2 1.2s ease-in-out infinite',
			shake3: 'shake3 1.9s ease-in-out infinite'
		},
  		fontFamily: {
  			sans: ["var(--font-sans)", ...fontFamily.sans]
  		},
  		scale: {
  			'-1': '-1'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
