import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, Button, SearchBar, Anchor, Divider, Text, Avatar } from "@vizality/components"
import { TextInput, SwitchItem, ButtonItem, Category, SliderInput } from '@vizality/components/settings';

const EnhancedImage = require("./EnhancedImage")

module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            preview_opened: true,
            custom_opened: true,
            zoom_opened: true
        }
    }

    render() {
        const settingSetup = {
            get: this.props.getSetting,
            set: this.props.setSetting
        }
        return <>
            <Category name="Image Preview" opened={this.state.preview_opened} onChange={()=> this.setState({ preview_opened: !this.state.preview_opened})}>
                <EnhancedImage settings={settingSetup} width={1798/2} height={600/2} src="https://raw.githubusercontent.com/hoofer-vizality/enhanced-image-viewer/main/assets/banner.png"/>
            </Category>
            <Category name="Customization" opened={this.state.custom_opened} onChange={()=> this.setState({ custom_opened: !this.state.custom_opened})}>

            </Category>
            <Category name="Zoom Settings" opened={this.state.zoom_opened} onChange={()=> this.setState({ zoom_opened: !this.state.zoom_opened})}>
            <SwitchItem
                note={"Turns your zoom lens into a circle rather than a square."}
                value={this.props.getSetting("circleLens", true)}
                onChange={()=> this.props.toggleSetting("circleLens", true)}
                >Round Lens</SwitchItem>
            <SwitchItem
                note={"Hides your lens when you are out of the image bounds."}
                value={this.props.getSetting("hideLens", true)}
                onChange={()=> this.props.toggleSetting("hideLens", true)}
                >Automatically Hide Lends</SwitchItem>
            <SwitchItem
                note={<Text><strong style={{color:"#f04747"}}>EXPERIMENTAL:</strong> Makes movements have a more smooth feeling.</Text>}
                value={this.props.getSetting("smoothLens", true)}
                onChange={()=> this.props.toggleSetting("smoothLens", true)}
                >Smoother Lens Movement</SwitchItem>
            <SwitchItem
                note={"Makes the lens preview appear more smooth, or watery. This does not effect the image itself."}
                value={this.props.getSetting("antiAliasLens", false)}
                onChange={()=> this.props.toggleSetting("antiAliasLens", false)}
                >Anti Aliased Lens Preview</SwitchItem>
            <SwitchItem
                note={"Adds a border and shadow to make the lens stand out."}
                value={this.props.getSetting("borderLens", true)}
                onChange={()=> this.props.toggleSetting("borderLens", true)}
                >Lens Border & Shadow</SwitchItem>
            </Category>
            
        </>
    }
}

/**                <SwitchItem
                note={"Makes the notification toasts slimmer at the cost of hiding the interactive buttons."}
                value={this.props.getSetting("slimToasts", true)}
                onChange={()=> this.props.toggleSetting("slimToasts", true)}
                >Slim Notification Toasts</SwitchItem>
                <SwitchItem
                note={"Makes the notification toasts slimmer at the cost of hiding the interactive buttons."}
                value={this.props.getSetting("slimToasts", true)}
                onChange={()=> this.props.toggleSetting("slimToasts", true)}
                >Slim Notification Toasts</SwitchItem>
                <SwitchItem
                note={"Makes the notification toasts slimmer at the cost of hiding the interactive buttons."}
                value={this.props.getSetting("slimToasts", true)}
                onChange={()=> this.props.toggleSetting("slimToasts", true)}
                >Slim Notification Toasts</SwitchItem> */