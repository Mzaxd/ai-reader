import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ==================== 颜色系统 - MotherDuck 风格 ==================== */
      colors: {
        // 主色 - 鸭黄色
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary-500)',
        },
        // 强调色 - 鸭橙色
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)',
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          DEFAULT: 'var(--color-accent-500)',
        },
        // 辅助色 - 天空蓝
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)',
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          DEFAULT: 'var(--color-secondary-500)',
        },
        // 背景色
        surface: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          elevated: 'var(--color-bg-elevated)',
          hover: 'var(--color-bg-hover)',
          overlay: 'var(--color-bg-overlay)',
        },
        // 语义色
        success: {
          light: 'var(--color-success-light)',
          DEFAULT: 'var(--color-success)',
          dark: 'var(--color-success-dark)',
        },
        warning: {
          light: 'var(--color-warning-light)',
          DEFAULT: 'var(--color-warning)',
          dark: 'var(--color-warning-dark)',
        },
        error: {
          light: 'var(--color-error-light)',
          DEFAULT: 'var(--color-error)',
          dark: 'var(--color-error-dark)',
        },
        info: {
          light: 'var(--color-info-light)',
          DEFAULT: 'var(--color-info)',
          dark: 'var(--color-info-dark)',
        },
      },

      /* ==================== 字体系统 ==================== */
      fontFamily: {
        sans: [
          'Manrope',
          'PingFang SC',
          'Source Han Sans SC',
          'Noto Sans SC',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Fira Code',
          'Source Code Pro',
          'monospace',
        ],
      },
      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-relaxed)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-relaxed)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-snug)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-snug)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-tight)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-tight)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-tight)' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: '1.1' }],
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
      letterSpacing: {
        tight: 'var(--letter-spacing-tight)',
        normal: 'var(--letter-spacing-normal)',
        wide: 'var(--letter-spacing-wide)',
      },

      /* ==================== 间距系统 ==================== */
      spacing: {
        '0': 'var(--space-0)',
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
      },

      /* ==================== 圆角系统 ==================== */
      borderRadius: {
        none: 'var(--radius-none)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },

      /* ==================== 阴影系统 ==================== */
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-accent': 'var(--shadow-glow-accent)',
        'glow-primary-lg': 'var(--shadow-glow-primary-lg)',
        'glow-accent-lg': 'var(--shadow-glow-accent-lg)',
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },

      /* ==================== 过渡动画 ==================== */
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
        slowest: 'var(--duration-slowest)',
      },
      transitionTimingFunction: {
        default: 'var(--ease-default)',
        in: 'var(--ease-in)',
        out: 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
        bounce: 'var(--ease-bounce)',
        smooth: 'var(--ease-smooth)',
      },

      /* ==================== MotherDuck 特色动画 ==================== */
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--ease-out)',
        'fade-in-up': 'fadeInUp var(--duration-slow) var(--ease-out)',
        'fade-in-left': 'fadeInLeft var(--duration-slow) var(--ease-out)',
        'slide-up': 'slideUp var(--duration-slow) var(--ease-out)',
        'slide-in-right': 'slideInRight var(--duration-slow) var(--ease-out)',
        'scale-in': 'scaleIn var(--duration-fast) var(--ease-bounce)',
        'scale-in-bounce': 'scaleInBounce var(--duration-normal) var(--ease-bounce)',
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scroll-text': 'scrollText 20s linear infinite',
        'gradient-flow': 'gradientFlow 15s ease infinite',
        'ai-thinking': 'aiThinking 1.5s ease-in-out infinite',
        'blink': 'blink 1s infinite',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        scaleInBounce: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 217, 61, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 217, 61, 0.5)' },
        },
        scrollText: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        gradientFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        aiThinking: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '-100% 0' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },

      /* ==================== Z-Index ==================== */
      zIndex: {
        dropdown: 'var(--z-dropdown)',
        sticky: 'var(--z-sticky)',
        fixed: 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        modal: 'var(--z-modal)',
        popover: 'var(--z-popover)',
        tooltip: 'var(--z-tooltip)',
        toast: 'var(--z-toast)',
      },

      /* ==================== 特殊工具类 ==================== */
      textColor: {
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        tertiary: 'var(--color-text-tertiary)',
        placeholder: 'var(--color-text-placeholder)',
        disabled: 'var(--color-text-disabled)',
      },
      borderColor: {
        DEFAULT: 'var(--color-border-default)',
        muted: 'var(--color-border-muted)',
        emphasis: 'var(--color-border-emphasis)',
        glow: 'var(--color-border-glow)',
      },
      backgroundColor: {
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
        tertiary: 'var(--color-bg-tertiary)',
        elevated: 'var(--color-bg-elevated)',
        hover: 'var(--color-bg-hover)',
        overlay: 'var(--color-bg-overlay)',
      },

      /* ==================== AI 组件专用 ==================== */
      backgroundImage: {
        'ai-bubble-user': 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
        'ai-bubble-thinking': 'linear-gradient(90deg, rgba(255, 217, 61, 0.1), rgba(255, 217, 61, 0.2), rgba(255, 217, 61, 0.1))',
        'gradient-primary': 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
        'gradient-bg': 'linear-gradient(-45deg, var(--color-bg-primary), var(--color-bg-secondary), var(--color-bg-tertiary), var(--color-bg-primary))',
      },

      /* ==================== 背景模糊 ==================== */
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '10px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [
    // 自定义插件：MotherDuck 风格组件
    function({ addUtilities, addComponents, theme }) {
      // AI 流式输出光标
      addUtilities({
        '.streaming-cursor::after': {
          content: '"|"',
          animation: 'blink 1s infinite',
          color: theme('colors.primary.500'),
        },
        // AI 思考动画背景
        '.ai-thinking-bg': {
          background: 'linear-gradient(90deg, rgba(255, 217, 61, 0.1), rgba(255, 217, 61, 0.2), rgba(255, 217, 61, 0.1))',
          backgroundSize: '200% 100%',
          animation: 'aiThinking 1.5s ease-in-out infinite',
        },
        // 滚动文字
        '.scroll-text-container': {
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        },
        '.scroll-text-content': {
          display: 'inline-flex',
          animation: 'scrollText 20s linear infinite',
        },
        // 玻璃质感
        '.glass-card': {
          background: 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-border-default)',
        },
        // 发光效果
        '.glow-primary': {
          boxShadow: 'var(--shadow-glow-primary)',
        },
        '.glow-accent': {
          boxShadow: 'var(--shadow-glow-accent)',
        },
        '.glow-primary-lg': {
          boxShadow: 'var(--shadow-glow-primary-lg)',
        },
        // 光晕装饰
        '.glow-orb': {
          position: 'absolute',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 217, 61, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        },
        // 网格背景
        '.grid-bg': {
          backgroundImage: [
            'linear-gradient(rgba(48, 54, 61, 0.3) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(48, 54, 61, 0.3) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '50px 50px',
        },
        // 渐变背景
        '.gradient-animated-bg': {
          background: 'linear-gradient(-45deg, var(--color-bg-primary), var(--color-bg-secondary), var(--color-bg-tertiary), var(--color-bg-primary))',
          backgroundSize: '400% 400%',
          animation: 'gradientFlow 15s ease infinite',
        },
      })

      // AI 对话气泡组件
      addComponents({
        '.ai-chat-bubble': {
          padding: 'var(--space-3) var(--space-4)',
          borderRadius: 'var(--radius-xl)',
          maxWidth: '80%',
          fontSize: 'var(--font-size-base)',
          lineHeight: 'var(--line-height-relaxed)',
        },
        '.ai-chat-bubble-user': {
          background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
          color: 'var(--color-bg-primary)',
          marginLeft: 'auto',
          borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-md) var(--radius-xl)',
        },
        '.ai-chat-bubble-assistant': {
          background: 'var(--color-ai-bubble-assistant)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) var(--radius-xl) var(--radius-md)',
        },
        '.ai-chat-bubble-thinking': {
          background: 'linear-gradient(90deg, rgba(255, 217, 61, 0.1), rgba(255, 217, 61, 0.2), rgba(255, 217, 61, 0.1))',
          backgroundSize: '200% 100%',
          border: '1px solid rgba(255, 217, 61, 0.3)',
          animation: 'aiThinking 1.5s ease-in-out infinite',
        },
        // AI 状态指示器
        '.ai-status-dot': {
          width: '8px',
          height: '8px',
          borderRadius: 'var(--radius-full)',
          display: 'inline-block',
        },
        '.ai-status-idle': {
          backgroundColor: 'var(--color-ai-idle)',
        },
        '.ai-status-processing': {
          backgroundColor: 'var(--color-ai-processing)',
          animation: 'pulse 2s ease-in-out infinite',
        },
        '.ai-status-success': {
          backgroundColor: 'var(--color-ai-success)',
        },
        '.ai-status-error': {
          backgroundColor: 'var(--color-ai-error)',
        },
        // MotherDuck 风格按钮
        '.btn-primary-gradient': {
          background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-500))',
          color: 'var(--color-bg-primary)',
          boxShadow: 'var(--shadow-glow-accent)',
          transition: 'all var(--duration-normal) var(--ease-default)',
        },
        '.btn-primary-gradient:hover': {
          boxShadow: 'var(--shadow-glow-accent-lg)',
          transform: 'translateY(-2px)',
        },
        // MotherDuck 风格卡片
        '.card-glass': {
          background: 'rgba(22, 27, 34, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-xl)',
          transition: 'all var(--duration-normal) var(--ease-default)',
        },
        '.card-glass:hover': {
          borderColor: 'var(--color-border-glow)',
          boxShadow: 'var(--shadow-card-hover)',
          transform: 'translateY(-4px)',
        },
      })
    },
  ],
}

export default config
