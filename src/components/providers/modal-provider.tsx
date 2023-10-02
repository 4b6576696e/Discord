"use client";

import React from 'react';
import CreateServer from '../modals/create-server';
import InvitePeople from '../modals/invite-people';
import useIsMounted from '../hooks/useIsMounted';
import EditServer from '../modals/edit-server';
import ManageMembers from '../modals/manage-members';
import CreateChannel from '../modals/create-channel';
import DeleteServer from '../modals/delete-server';
import LeaveServer from '../modals/leave-server';
import EditChannel from '../modals/edit-channel';
import AtachmentFile from '../modals/attachment-file';
import DeleteMessage from '../modals/delete-message';
import DeleteChannel from '../modals/delete-channel';

type Props = {};

function ModalProvider({ }: Props) {
    if (!useIsMounted()) return;

    return (
        <>
            <CreateServer />
            <InvitePeople />
            <EditServer />
            <ManageMembers />
            <CreateChannel />
            <DeleteServer />
            <LeaveServer />
            <EditChannel />
            <DeleteChannel />
            <AtachmentFile />
            <DeleteMessage />
        </>
    );
}

export default React.memo(ModalProvider);