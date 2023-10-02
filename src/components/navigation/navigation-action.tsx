import React from 'react';
import ActionTooltip from '../action-tooltip';
import { Plus } from 'lucide-react';
import { useModalStore } from '../../store/modal-store';

type Props = {
    profileId: string
};

function NavigationAction({profileId }: Props) {
    const { onOpen } = useModalStore();

    return (
        <div
            autoFocus={false}
        >
            <ActionTooltip
                label="create server"
                side="right"
                align='center'
            >
                <button
                    onClick={() => onOpen("create-server", {profileId})}
                    className='flex items-center group'
                    autoFocus={false}
                >
                    <div
                        autoFocus={false}
                        className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus
                            focusable={false}
                            className='group-hover:text-white transition text-emerald-500'
                            size={25}
                        />
                    </div>
                </button>
            </ActionTooltip>
        </div>
    );
}

export default NavigationAction;


