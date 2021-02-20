import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, Button, SearchBar, Anchor, Divider, Text, Avatar, ColorPicker, KeyboardShortcut } from "@vizality/components"
import { FormItem, TextInput, SwitchItem, ButtonItem, RadioGroup, Category, SliderInput, ColorPickerInput } from '@vizality/components/settings';

const EnhancedImage = require("./EnhancedImage")

module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            preview_opened: true,
            custom_lens_opened: false,
            settings_lens_opened: false,
            custom_image_opened: false,
            settings_image_opened: false
        }
    }

    // ColorPicker

    render() {
        const settingSetup = {
            get: this.props.getSetting,
            set: this.props.setSetting
        }
        return <>
            <Category name="Image Preview" opened={this.state.preview_opened} onChange={()=> this.setState({ preview_opened: !this.state.preview_opened})}>
                <EnhancedImage settings={settingSetup} width={1798/2} height={600/2} src="https://raw.githubusercontent.com/hoofer-vizality/enhanced-image-viewer/main/assets/banner.png"/>
            </Category>
            <Category name="Lens Customization" opened={this.state.custom_lens_opened} onChange={()=> this.setState({ custom_lens_opened: !this.state.custom_lens_opened})}>
                <ColorPickerInput
                    colors={[1752220,3066993,3447003,10181046,15277667,15844367,15105570,15158332,9807270,6323595,1146986,2067276,2123412,7419530,11342935,12745742,11027200,10038562,9936031,5533306]}
                    default={15277667}
                    onChange={s => this.props.updateSetting("lensOutlineColor", `${s.toString(16)}`)}
                    disabled={false}
                    value={parseInt(this.props.getSetting("lensOutlineColor", "	E91E63"),16)}
                    title={"Lens Color Outline"}
                    note={"The color outline for the border of the lens."}
                />
                <SliderInput
                    minValue={1}
                    maxValue={10}
                    stickToMarkers
                    markers={[1,2,3,4,5,6,7,8,9,10]}
                    initialValue={this.props.getSetting("lensOutlineWidth", 1)}
                    onValueChange={(v)=> this.props.updateSetting("lensOutlineWidth", v)}
                    note="The width of the border of the lens."
                    onMarkerRender={(v)=>{return `${v}px`}}
                >Lens Border Width</SliderInput>
                <RadioGroup
                    options={[
                        {name: "Solid", desc: "One solid line.", value: "solid"},
                        {name: "Dashed", desc: "One line with dashes.", value: "dashed"},
                        {name: "Dotted", desc: "One line made of dots.", value: "dotted"},
                        {name: "Double", desc: "Two solid lines with a small margin.", value: "double"},
                        {name: "Groove", desc: "One line with a grOoOoOvy line. (～￣▽￣)～", value: "groove"},
                    ]}
                    value={this.props.getSetting("lensOutlineStyle", "solid")}
                    onChange={(v)=> this.props.updateSetting("lensOutlineStyle", v.value)}
                    note={"The type of border style the lens will use."}
                >Lens Border Type</RadioGroup>
                <SwitchItem
                    note={"Adds a border and shadow to make the lens stand out."}
                    value={this.props.getSetting("borderLens", true)}
                    onChange={()=> this.props.toggleSetting("borderLens", true)}
                >Lens Border & Shadow</SwitchItem>
                <SwitchItem
                    note={"Turns your zoom lens into a circle rather than a square."}
                    value={this.props.getSetting("circleLens", true)}
                    onChange={()=> this.props.toggleSetting("circleLens", true)}
                >Round Lens</SwitchItem>
            </Category>
            <Category name="Lens Settings" opened={this.state.settings_lens_opened} onChange={()=> this.setState({ settings_lens_opened: !this.state.settings_lens_opened})}>
                <SliderInput
                    minValue={1}
                    maxValue={10}
                    stickToMarkers
                    markers={[50,100,150,200,250,300,350,400,450,500]}
                    initialValue={this.props.getSetting("lensInitialSize", 150)}
                    onValueChange={(v)=> this.props.updateSetting("lensInitialSize", v)}
                    note="The initial size that the lens starts out with."
                    onMarkerRender={(v)=>{return `${v}px`}}
                >Initial Lens Size</SliderInput>
                <SwitchItem
                    note={"Inverts the ctrl + scroll and scroll binds."}
                    value={this.props.getSetting("invertLensControls", false)}
                    onChange={()=> this.props.toggleSetting("invertLensControls", false)}
                >Invert Controls</SwitchItem>
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
                    value={this.props.getSetting("antiAliasLens", true)}
                    onChange={()=> this.props.toggleSetting("antiAliasLens", true)}
                >Anti Aliased Lens Preview</SwitchItem>
            </Category>
            <Category name="Image Customization" opened={this.state.custom_image_opened} onChange={()=> this.setState({ custom_image_opened: !this.state.custom_image_opened})}>
                <SwitchItem
                        note={"Automatically darkens the image when using the lens."}
                        value={this.props.getSetting("darkenImage", true)}
                        onChange={()=> this.props.toggleSetting("darkenImage", true)}
                >Darken Image When Magnifying</SwitchItem>
            </Category>
            <Category name="Image Settings" opened={this.state.settings_image_opened} onChange={()=> this.setState({ settings_image_opened: !this.state.settings_image_opened})}>
                <RadioGroup
                    options={[
                        {name: "Never Active", desc: "Fully disables the lens.", value: "never"},
                        {name: "Always Active", desc: "Automatically enables the lens when hovering over the image.", value: "always"},
                        {name: "Click Toggle", desc: "Enables the lens when clicking on an image.", value: "click"},
                        {name: "Hold Toggle", desc: "Enables the lens while the mouse is down on the image.", value: "hold"},
                    ]}
                    value={this.props.getSetting("lensToggleMode", "click")}
                    onChange={(v)=> this.props.updateSetting("lensToggleMode", v.value)}
                    note={"The toggle mode for the image lens."}
                >Lens Toggle Mode</RadioGroup>
            </Category>
        </>
    }
}

/**        darkenImage        <SwitchItem
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