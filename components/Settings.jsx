import { React, getModule, getModuleByDisplayName, contextMenu } from "@vizality/webpack"
import { Modal, Icon, Button, SearchBar, Anchor, Divider, Text, Avatar, ColorPicker } from "@vizality/components"
import { FormItem, TextInput, SwitchItem, ButtonItem, RadioGroup, Category, SliderInput, ColorPickerInput } from '@vizality/components/settings';

const EnhancedImage = require("./EnhancedImage")

module.exports = class Settings extends React.PureComponent {
    constructor(props){
        super(props)
        this.state = {
            preview_opened: true,
            custom_opened: true,
            custom_lens_opened: false,
            zoom_opened: true
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
            <Category name="Customization" opened={this.state.custom_opened} onChange={()=> this.setState({ custom_opened: !this.state.custom_opened})}>
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
                            {color: "#7289da", name: "Solid", desc: "One solid line.", value: "solid"},
                            {color: "#7289da", name: "Dashed", desc: "One line with dashes.", value: "dashed"},
                            {color: "#7289da", name: "Dotted", desc: "One line made of dots.", value: "dotted"},
                            {color: "#7289da", name: "Double", desc: "Two solid lines with a small margin.", value: "double"},
                            {color: "#7289da", name: "Groove", desc: "One line with a grOoOoOvy line. (～￣▽￣)～", value: "groove"},
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
                </Category>
                <Category name="Lens Settings" opened={this.state.zoom_opened} onChange={()=> this.setState({ zoom_opened: !this.state.zoom_opened})}>
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
                </Category>
                <SwitchItem
                        note={"Automatically darkens the image when using the lens."}
                        value={this.props.getSetting("darkenImage", true)}
                        onChange={()=> this.props.toggleSetting("darkenImage", true)}
                >Darken Image When Magnifying</SwitchItem>
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