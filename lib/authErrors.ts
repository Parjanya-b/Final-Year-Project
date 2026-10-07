export function friendlyError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':  return 'This email is already registered. Try logging in.';
    case 'auth/invalid-email':         return 'Please enter a valid email address.';
    case 'auth/weak-password':         return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':        return 'Incorrect email or password.';
    case 'auth/too-many-requests':     return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/popup-closed-by-user':  return 'Google sign-in was cancelled.';
    case 'auth/network-request-failed':return 'Network error. Check your internet connection.';
    case 'permission-denied':          return 'Database permission denied. Publish the Firestore rules (Step 9).';
    default:                           return 'Something went wrong. Please try again.';
  }
}