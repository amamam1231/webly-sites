/**
 * Icon Registry - Strict whitelist of allowed lucide-react icons
 * This prevents AI hallucinations and ensures only valid icons are used
 */

import {
  // Basic UI
  Home,
  Menu,
  X,
  Search,
  Settings,
  User,
  Users,
  Bell,
  Mail,
  Phone,

  // Navigation
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,

  // Actions
  Check,
  Plus,
  Minus,
  Edit,
  Trash,
  Eye,
  EyeOff,
  Copy,
  Share,
  Send,
  Download,
  Upload,

  // Status
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,

  // Social
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Github,
  Globe,
  Link,
  ExternalLink,

  // Business
  ShoppingCart,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,

  // Files
  File,
  Folder,
  Save,
  Print,
  Bookmark,
  Calendar,
  Clock,
  Tag,
  Flag,

  // Media
  Image,
  Video,
  Camera,
  Music,
  Mic,
  Headphones,
  Volume,
  Play,
  Pause,

  // System
  Lock,
  Unlock,
  Shield,
  Database,
  Server,
  Cloud,
  Wifi,
  Battery,
  Monitor,
  Smartphone,

  // Design
  Sun,
  Moon,
  Star,
  Heart,
  Zap,
  Target,
  Award,
  Trophy,
  Gift,
  Coffee,

  type LucideIcon
} from '

/**
 * Icon Registry Map - Maps string keys to actual icon components
 * Only these keys are valid for use with SafeIcon component
 */
export const ICON_REGISTRY: Record<string, LucideIcon> = {
  // Basic UI
  '
  '
  '
  '
  '
  '
  '
  '
  '
  '

  // Navigation
  '
  '
  '
  '
  '
  '
  '
  '

  // Actions
  '
  '
  '
  '
  '
  '
  '
  '
  '
  '
  '
  '

  // Status
  '
  '
  '
  '
  '
  '

  // Social
  '
  '
  '
  '
  '
  '
  '
  '
  '

  // Business
  '
  '
  '
  '
  '
  '
  '

  // Files
  '
  '
  '
  '
  '
  '
  '
  '
  '

  // Media
  '
  '
  '
  '
  '
  '
  '
  '
  '

  // System
  '
  '
  '
  '
  '
  '
  '
  '
  '
  '

  // Design
  '
  '
  '
  '
  '
  '
  '
  '
  '
  '
};

/**
 * Type-safe icon keys - only these strings are valid
 */
export type IconKey = keyof typeof ICON_REGISTRY;

/**
 * Get list of all valid icon keys
 */
export const getValidIconKeys = (): IconKey[] => {
  return Object.keys(ICON_REGISTRY) as IconKey[];
};

/**
 * Check if a string is a valid icon key
 */
export const isValidIconKey = (key: string): key is IconKey => {
  return key in ICON_REGISTRY;
};
