import React, { useState, useEffect } from 'react'

// Global store for the deferred prompt - captures it once at page load
let globalDeferredPrompt = null
let globalPromptListeners = []

// Initialize global listener immediately
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        globalDeferredPrompt = e
        // Notify all listeners
        globalPromptListeners.forEach(listener => listener(e))
    })

    window.addEventListener('appinstalled', () => {
        globalDeferredPrompt = null
        globalPromptListeners.forEach(listener => listener(null))
    })
}

const InstallPWA = ({ isOpen, onClose }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt)
    const [isInstalled, setIsInstalled] = useState(false)
    const [isInstalling, setIsInstalling] = useState(false)

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Sync with global prompt
        setDeferredPrompt(globalDeferredPrompt)

        // Subscribe to global prompt changes
        const handlePromptChange = (prompt) => {
            setDeferredPrompt(prompt)
            if (!prompt && globalDeferredPrompt === null) {
                // Check if installed after prompt is cleared
                if (window.matchMedia('(display-mode: standalone)').matches) {
                    setIsInstalled(true)
                }
            }
        }

        globalPromptListeners.push(handlePromptChange)

        return () => {
            globalPromptListeners = globalPromptListeners.filter(l => l !== handlePromptChange)
        }
    }, [])

    const handleInstall = async () => {
        const prompt = deferredPrompt || globalDeferredPrompt

        if (!prompt) {
            return
        }

        setIsInstalling(true)

        try {
            prompt.prompt()
            const { outcome } = await prompt.userChoice

            if (outcome === 'accepted') {
                setIsInstalled(true)
                globalDeferredPrompt = null
                setDeferredPrompt(null)
                // Close modal after successful install
                setTimeout(() => onClose(), 1500)
            }
        } catch (error) {
            console.error('Install failed:', error)
        } finally {
            setIsInstalling(false)
        }
    }

    if (!isOpen) return null

    const canInstallNow = deferredPrompt || globalDeferredPrompt

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-gradient-to-br from-blue-900/95 via-blue-800/95 to-blue-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-white/20">
                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent"></div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
                >
                    <i className="ri-close-line text-2xl"></i>
                </button>

                {/* Content */}
                <div className="relative p-8">
                    {/* App Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 bg-white/10 rounded-2xl p-3 shadow-lg border border-white/20">
                            <img
                                src="/Logo2.png"
                                alt="Budgetify"
                                className="w-full h-full object-contain"
                            />
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white text-center mb-2">
                        {isInstalled ? 'App Installed!' : 'Install Budgetify'}
                    </h2>

                    <p className="text-blue-200 text-center mb-6">
                        {isInstalled
                            ? 'Budgetify is now installed on your device.'
                            : 'Get quick access to your budget manager'}
                    </p>

                    {/* Benefits */}
                    {!isInstalled && (
                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                    <i className="ri-flashlight-line text-xl text-green-400"></i>
                                </div>
                                <span>Quick access from home screen</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                    <i className="ri-fullscreen-line text-xl text-purple-400"></i>
                                </div>
                                <span>Full-screen experience</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/90">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                    <i className="ri-wifi-off-line text-xl text-orange-400"></i>
                                </div>
                                <span>Works offline</span>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        {isInstalled ? (
                            <button
                                onClick={onClose}
                                className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <i className="ri-check-line text-xl"></i>
                                Done
                            </button>
                        ) : canInstallNow ? (
                            <button
                                onClick={handleInstall}
                                disabled={isInstalling}
                                className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isInstalling ? (
                                    <>
                                        <i className="ri-loader-4-line text-xl animate-spin"></i>
                                        Installing...
                                    </>
                                ) : (
                                    <>
                                        <i className="ri-download-line text-xl"></i>
                                        Install Now
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="p-4 bg-white/10 rounded-xl">
                                    <p className="text-white/80 text-sm">
                                        <i className="ri-information-line mr-2"></i>
                                        To install on iOS, tap the Share button <i className="ri-share-line"></i> then "Add to Home Screen"
                                    </p>
                                    <p className="text-blue-200 text-xs mt-2">
                                        On desktop/Android, look for the install icon <i className="ri-add-box-line"></i> in the address bar.
                                    </p>
                                </div>
                            </div>
                        )}

                        {!isInstalled && (
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-6 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
                            >
                                Maybe Later
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Custom hook to manage PWA install state globally
export const usePWAInstall = () => {
    const [canInstall, setCanInstall] = useState(!!globalDeferredPrompt)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Sync initial state
        setCanInstall(!!globalDeferredPrompt)

        const handlePromptChange = (prompt) => {
            setCanInstall(!!prompt)
            if (!prompt) {
                if (window.matchMedia('(display-mode: standalone)').matches) {
                    setIsInstalled(true)
                }
            }
        }

        globalPromptListeners.push(handlePromptChange)

        return () => {
            globalPromptListeners = globalPromptListeners.filter(l => l !== handlePromptChange)
        }
    }, [])

    return { canInstall, isInstalled }
}

// Export a function to trigger install directly from anywhere
export const triggerPWAInstall = async () => {
    if (!globalDeferredPrompt) {
        return { success: false, reason: 'no-prompt' }
    }

    try {
        globalDeferredPrompt.prompt()
        const { outcome } = await globalDeferredPrompt.userChoice

        if (outcome === 'accepted') {
            globalDeferredPrompt = null
            return { success: true }
        }
        return { success: false, reason: 'dismissed' }
    } catch (error) {
        return { success: false, reason: error.message }
    }
}

export default InstallPWA
