'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import { Skeleton } from '@/app/components/ui/skeleton'

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
    return function AuthComponent(props: P) {
        const { user, loading } = useAuth()
        const router = useRouter()

        useEffect(() => {
            if (!loading && !user) {
                router.push('/login')
            }
        }, [loading, user, router])

        if (loading || !user) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-4">
                        <Skeleton className="h-12 w-[250px] mx-auto" />
                        <Skeleton className="h-4 w-[300px] mx-auto" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            )
        }

        return <WrappedComponent {...props} />
    }
}

