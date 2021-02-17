import React from 'react';

import { Plugin } from '@vizality/entities';
import { patch, unpatch } from '@vizality/patcher';
import { getModuleByDisplayName, getModule, getModules } from '@vizality/webpack';
import { get } from '@vizality/http';
import { open as openModal, close as closeModal, closeAll as closeAllModals } from '@vizality/modal';
import { clipboard } from 'electron';
import { Modal, Icon, ShinyButton, Button, SearchBar, Anchor, Divider, Text, Avatar, AsyncComponent } from "@vizality/components"
import { TextInput, SwitchItem, ButtonItem, Category, SliderInput } from '@vizality/components/settings';

const EnhancedImage = require("./components/EnhancedImage")
const Settings = require("./components/Settings")

export default class EnhancedImageViewer extends Plugin {
    async start () {
        //theming
        this.injectStyles('style.scss');  
        // modules
        const ImageModal = await getModule(m => m.default && m.default.displayName === "ImageModal");
        const MaskedLink = AsyncComponent.fromDisplayName("MaskedLink");
        const transitionTo = getModule(["transitionTo"], false).transitionTo;
        // injectors
        patch("image-modal", ImageModal.default.prototype, "render", (args, res)=>{
            const image = res.props.children[0];
            const details = res.props.children[1];
            res.props.children[0] = (<EnhancedImage settings={this.settings} width={image.props.maxWidth} height={image.props.maxHeight} src={image.props.src}/>);  
            res.props.children.push(<a
            href=""
            className="downloadLink-1ywL9o"
            target="_blank"
            role="button"
            onClick={(e)=>{
                e.preventDefault();
                transitionTo("/channels/738968108827541524/738968109288914976/811740824501092353");
            }}
            >| Open Settings</a>
            )
            return res;
        })

    }

    stop () {
        unpatch("image-modal")
    }
}
