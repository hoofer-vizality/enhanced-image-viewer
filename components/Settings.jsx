import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, Button, SearchBar, Anchor, Divider, Text, Avatar } from "@vizality/components"
import { TextInput, SwitchItem, ButtonItem, Category, SliderInput } from '@vizality/components/settings';

const EnhancedImage = require("./EnhancedImage")

module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            preview_opened: true,
            custom_opened: true
        }
    }

    render() {
        
        return <>
            <Category name="Image Preview" opened={this.state.preview_opened} onChange={()=> this.setState({ preview_opened: !this.state.preview_opened})}>
                <EnhancedImage width={843} height={249} src="https://cdn.discordapp.com/attachments/738968109288914976/811361409089798225/unknown.png"/>
            </Category>
            <Category name="Customization" opened={this.state.custom_opened} onChange={()=> this.setState({ custom_opened: !this.state.custom_opened})}>
                <SwitchItem
                note={"Makes the notification toasts slimmer at the cost of hiding the interactive buttons."}
                value={this.props.getSetting("slimToasts", true)}
                onChange={()=> this.props.toggleSetting("slimToasts", true)}
                >Slim Notification Toasts</SwitchItem>
            </Category>
        </>
    }
}