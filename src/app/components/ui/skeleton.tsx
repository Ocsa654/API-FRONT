import { HTMLAttributes } from 'react'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function Skeleton({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={classNames("animate-pulse rounded-md bg-gray-200", className || '')}
            {...props}
        />
    )
}

export { Skeleton }
