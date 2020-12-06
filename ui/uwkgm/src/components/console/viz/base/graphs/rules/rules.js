import React, { Suspense } from 'react';
import clsx from 'clsx';
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";

import AddIcon from '@material-ui/icons/Add';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DeleteIcon from '@material-ui/icons/Delete';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import LineWeightIcon from '@material-ui/icons/LineWeight';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Tooltip from '@material-ui/core/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { ChromePicker } from 'react-color';
import { List } from 'react-movable';

import FontColorIcon from 'assets/icons/FontColor';
import LabelBackgroundIcon from 'assets/icons/LabelBackground';
import LabelBorderIcon from 'assets/icons/LabelBorder';
import NodeBorderIcon from 'assets/icons/NodeBorder';
import NodeColorIcon from 'assets/icons/NodeColor';

import { EntitySearchPopover } from 'services/entities/search/search';
import { getStyles } from 'styles/styles';
import { init, updateTools } from '../graphs.action';
import { styles } from './rules.css';

const IconPicker = React.lazy(() => import('components/console/viz/base/graphs/rules/icons/icons'));

const usePullUpTransition = transition => ({
    marginTop: transition === 'in' ? 0 : 15
});

const convertRGBA = color => {
    if (color !== null) {
        return 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + color.a + ')';
    } else {
        return null;
    }
}

export class RulesClass extends React.Component {
    state = {
        transition: null,
        iconCallback: null
    }

    constructor(props) {
        super(props);
        this.isComponentMounted = false;
    }

    handleIconOpen = callback => {
        this.setState(() => ({iconCallback: callback}));
    }

    handleIconClose = value => {
        this.state.iconCallback(value);
        this.setState(() => ({iconCallback: null}));
    }

    componentDidMount() {
        this.setState({transition: 'in'});
        this.isComponentMounted = true;
    }

    componentWillUnmount() {
        this.isComponentMounted = false;
    }

    render() {
        return (
            <RulesFunc 
                isComponentMounted={this.isComponentMounted}
                catalogReducer={this.props.reducers.catalogs}
                toolReducer={this.props.reducers.graphs.tools}
                updateTools={this.props.actions.graphs.updateTools}
                colorSet={this.props.reducers.graphs.options.styles.colorSet}
                transition={this.state.transition}
                iconCallback={this.state.iconCallback}
                toggleRulePage={this.props.toggleRulePage}
                onIconOpen={this.handleIconOpen}
                onIconClose={this.handleIconClose}
            />
        );
    }
}

const RulesFunc = props => {
    const classes = getStyles(styles.rules);
    const {
        isComponentMounted,
        catalogReducer,
        toolReducer,
        updateTools,
        colorSet,
        transition,
        iconCallback,
        toggleRulePage,
        onIconOpen,
        onIconClose
    } = props;

    const handleResetClick = () => {
        var tools = toolReducer;
        tools.rules.manual = [];
        updateTools(tools);
    }

    return (
        <React.Fragment>
            <div className={classes.outerContainer} style={{opacity: transition === 'in' ? 1 : 0}}>
                <div className={classes.innerContainer}>
                    <div 
                        className={classes.title} 
                        style={{...usePullUpTransition(transition)}}>
                        Rules
                    </div>
                    <div 
                        className={classes.description}
                        style={{...usePullUpTransition(transition)}}>
                        Rules are ranked in ascending order. Drag them to rearrange their order.
                    </div>
                    <Tabs
                        value={0}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={() => {}}
                        className={classes.tabs}
                        style={{...usePullUpTransition(transition)}}
                    >
                        <Tab label="Manual" />
                    </Tabs>
                    <Manual 
                        isComponentMounted={isComponentMounted}
                        catalogReducer={catalogReducer}
                        toolReducer={toolReducer}
                        updateTools={updateTools}
                        colorSet={colorSet}
                        onIconOpen={onIconOpen}
                    />
                </div>
            </div>
            <div className={classes.actionContainer}>
                <div className={classes.actionBlock}>
                    <button type="button" className="btn btn-primary" style={{marginRight: 5}} onClick={toggleRulePage}>Close</button>
                    <button type="button" className="btn btn-danger" style={{marginLeft: 5}} onClick={handleResetClick}>Restore Default</button>
                </div>
            </div>
            {iconCallback !== null ? 
                <Suspense fallback={<div>Loading...</div>}>
                    <IconPicker onClose={onIconClose} /> 
                </Suspense>
            : ''}
        </React.Fragment>
    );
}

const Selector = props => {
    const classes = getStyles(styles.form);
    const {
        choices,
        value,
        onClick
    } = props;

    const handleButtonClick = event => {
        onClick(event, choices, value);
    }

    return (
        <button className={clsx([classes.block, classes.select])} onClick={handleButtonClick}>
            <span>{'title' in choices[value] ? choices[value].title : choices[value]}</span>
            <KeyboardArrowDownIcon style={{fontSize: '1em'}} />
        </button>
    );
}

const SelectorMenu = props => {
    const { 
        selector,
        onClose
    } = props;

    return (
        <Menu
            anchorEl={Boolean(selector) ? selector.element : null}
            keepMounted
            open={Boolean(selector)}
            onClose={onClose}
        >
            {Boolean(selector) ?
                Object.keys(selector.choices).map((key, index) => (
                    <MenuItem 
                        key={index}
                        selected={selector.value === key}
                        disabled={selector.choices[key].disabled}
                        onClick={() => selector.onSelect(key)}
                        dense
                    >{'title' in selector.choices[key] ? selector.choices[key].title : selector.choices[key]}</MenuItem>
                ))
            : ''}
        </Menu>
    );
}

const Entity = props => {
    const classes = getStyles(styles.form);
    const {
        value,
        onClick
    } = props;

    const handleButtonClick = event => {
        onClick(event, value);
    }

    return (
        <button 
            className={clsx([classes.block, classes.select, classes.entity], {[classes.entityEmpty]: value === null})} 
            onClick={handleButtonClick}
        >
            {value === null ? 
                <span style={{paddingLeft: 10, paddingRight: 10}}>...</span>
            :
                value.label !== null ?
                    <span>{value.label}</span>
                :
                    <span>{value.entity}</span>
            }
            <KeyboardArrowDownIcon style={{fontSize: '1em'}} />
        </button>
    );
}

const ColorPopover = props => {
    const {
        selector,
        onSelect,
        onClose,
        initColor
    } = props;

    const [color, setColor] = React.useState(initColor || {r: 0, g: 0, b: 0, a: 1});

    const handleColorChange = newColor => {
        onSelect(newColor);
        setColor(newColor.rgb);
    }

    return (
        <Popover
            anchorEl={Boolean(selector) ? selector : null}
            open={Boolean(selector)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <ChromePicker 
                color={color}
                onChange={handleColorChange}
            />
        </Popover>
    );
}

const LabelStylePopover = props => {
    const [buttonSelector, setButtonSelector] = React.useState(null);
    const [targetStyle, setTargetStyle] = React.useState(null);
    const [value, setValue] = React.useState(null);
    const {
        selector,
        onSelect,
        onClose,
        styles
    } = props;

    const handleButtonClick = (event, style) => {
        setButtonSelector(event.currentTarget);
        setValue(styles[style]);
        setTargetStyle(style);
    }

    const handleColorSelect = color => {
        onSelect(targetStyle, color.rgb);
    }

    const handleButtonClose = () => {
        setButtonSelector(null);
        setTargetStyle(null);
    }

    return (
        <Popover
            anchorEl={Boolean(selector) ? selector : null}
            open={Boolean(selector)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <ButtonGroup variant="text" color="primary">
                <Tooltip title="Font Color" arrow>
                    <Button onClick={event => handleButtonClick(event, 'fontColor')}>
                        <FontColorIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Background Color" arrow>
                    <Button onClick={event => handleButtonClick(event, 'backgroundColor')}>
                        <LabelBackgroundIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Border Color" arrow>
                    <Button onClick={event => handleButtonClick(event, 'borderColor')}>
                        <LabelBorderIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Border Weight" arrow>
                    <Button>
                        <LineWeightIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Font Size" arrow>
                    <Button>
                        <FormatSizeIcon />
                    </Button>
                </Tooltip>
            </ButtonGroup>
            {targetStyle === 'fontColor' || targetStyle === 'backgroundColor' || targetStyle === 'borderColor' ?
                <ColorPopover 
                    selector={buttonSelector}
                    onSelect={handleColorSelect}
                    onClose={handleButtonClose}
                    initColor={value}
                />
            : '' }
        </Popover>
    );
}

const NodeStylePopover = props => {
    const [buttonSelector, setButtonSelector] = React.useState(null);
    const [targetStyle, setTargetStyle] = React.useState(null);
    const [value, setValue] = React.useState(null);
    const {
        selector,
        onSelect,
        onClose,
        styles
    } = props;

    const handleButtonClick = (event, style) => {
        setButtonSelector(event.currentTarget);
        setValue(styles[style]);
        setTargetStyle(style);
    }

    const handleColorSelect = color => {
        onSelect(targetStyle, color.rgb);
    }

    const handleButtonClose = () => {
        setButtonSelector(null);
        setTargetStyle(null);
    }

    return (
        <Popover
            anchorEl={Boolean(selector) ? selector : null}
            open={Boolean(selector)}
            onClose={onClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            <ButtonGroup variant="text" color="primary">
                <Tooltip title="Background Color" arrow>
                    <Button onClick={event => handleButtonClick(event, 'backgroundColor')}>
                        <NodeColorIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Border Color" arrow>
                    <Button onClick={event => handleButtonClick(event, 'borderColor')}>
                        <NodeBorderIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Border Weight" arrow>
                    <Button>
                        <LineWeightIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Size" arrow>
                    <Button>
                        <BubbleChartIcon />
                    </Button>
                </Tooltip>
            </ButtonGroup>
            {targetStyle === 'backgroundColor' || targetStyle === 'borderColor' ?
                <ColorPopover 
                    selector={buttonSelector}
                    onSelect={handleColorSelect}
                    onClose={handleButtonClose}
                    initColor={value}
                />
            : '' }
        </Popover>
    );
}

const Manual = props => {
    const classes = getStyles(styles);
    const [selectingId, setSelectingId] = React.useState(null);
    const [ruleSelector, setRuleSelector] = React.useState(null);
    const [entitySelector, setEntitySelector] = React.useState(null);
    const [colorSelector, setColorSelector] = React.useState(null);
    const [labelStyleSelector, setLabelStyleSelector] = React.useState(null);
    const [nodeStyleSelector, setNodeStyleSelector] = React.useState(null);
    const {
        // isComponentMounted,
        // catalogReducer,
        toolReducer,
        updateTools,
        colorSet,
        onIconOpen
    } = props;

    const handleRuleAdd = async () => {
        var tools = toolReducer;

        tools.rules.manual.push({
            rule: ['node', 'ofType'],
            values: [null, null],
            visible: true,
            styles: {
                icon: null,
                node: {
                    backgroundColor: colorSet[tools.rules.manual.length % colorSet.length],
                    borderColor: null,
                    size: null
                },
                label: {
                    backgroundColor: null,
                    borderColor: null,
                    borderSize: null,
                    fontColor: null,
                    fontSize: null
                }
            }
        });

        updateTools(tools);
    }

    const handleRuleOrderChange = async ({oldIndex, newIndex}) => {
        var tools = toolReducer;
        const temp = tools.rules.manual[oldIndex];

        if (newIndex > oldIndex) {
            for (let i = 0; i < tools.rules.manual.length; i++) {
                if (i >= oldIndex && i < newIndex) {
                    tools.rules.manual[i] = tools.rules.manual[i + 1];
                }
            }
        } else {
            for (let i = tools.rules.manual.length - 1; i >= 0 ; i--) {
                if (i > newIndex && i <= oldIndex) {
                    tools.rules.manual[i] = tools.rules.manual[i - 1];
                }
            }
        }

        tools.rules.manual[newIndex] = temp;
        updateTools(tools);
    }

    const handleRuleSelectorClick = (event, level, choices, value, ruleId) => {
        setRuleSelector({
            element: event.currentTarget, 
            choices: choices,
            value: value,
            onSelect: value => handleRuleSelectorSelect(level, choices, value, ruleId)
        });
    }

    const handleRuleSelectorSelect = (level, choices, value, ruleId) => {
        if (typeof ruleId !== 'undefined') {
            var tools = toolReducer;
            tools.rules.manual[ruleId].rule[level] = choices[value].value;
            updateTools(tools);
        }

        setRuleSelector(null);
    }

    const handleRuleSelectorClose = () => {
        setRuleSelector(null);
    }

    const handleEntityClick = (event, value, ruleId, level) => {
        setEntitySelector({
            element: event.currentTarget,
            value: value,
            ruleId: ruleId,
            level: level
        });
    }

    const handleEntityClose = () => {
        setEntitySelector(null);
    }

    const handleEntitySelect = (entity) => {
        var tools = toolReducer;
        tools.rules.manual[entitySelector.ruleId].values[entitySelector.level] = entity;
        updateTools(tools);
    }

    const handleVisibilityClick = ruleId => {
        var tools = toolReducer;
        tools.rules.manual[ruleId].visible = !tools.rules.manual[ruleId].visible
        updateTools(tools);
    }

    const handleIconSelect = (ruleId, path) => {
        var tools = toolReducer;
        tools.rules.manual[ruleId].styles.icon = path;
        updateTools(tools);
    }

    const handleLabelStyleClick = (event, ruleId) => {
        setLabelStyleSelector(event.currentTarget);
        setSelectingId(ruleId);
    }

    const handleLabelStyleSelect = (style, value) => {
        var tools = toolReducer;
        tools.rules.manual[selectingId].styles.label[style] = value;
        updateTools(tools);
    }

    const handleLabelStyleClose = () => {
        setLabelStyleSelector(null);
    }

    const handleNodeStyleClick = (event, ruleId) => {
        setNodeStyleSelector(event.currentTarget);
        setSelectingId(ruleId);
    }

    const handleNodeStyleSelect = (style, value) => {
        var tools = toolReducer;
        tools.rules.manual[selectingId].styles.node[style] = value;
        updateTools(tools);
    }

    const handleNodeStyleClose = () => {
        setNodeStyleSelector(null);
    }

    return (
        <React.Fragment>
            {toolReducer.rules.manual.length ?
                <List 
                    values={toolReducer.rules.manual}
                    onChange={handleRuleOrderChange}
                    renderList={({ children, props }) => 
                        <React.Fragment>
                            <div className={classes.manual.headContainer}>
                                <div />
                                <div>Rule</div>
                                <div>Visible</div>
                                <div>Icon</div>
                                <div>Styles</div>
                                <div />
                                <div />
                            </div>
                            <div {...props}>{children}</div>
                        </React.Fragment>
                    }
                    renderItem={({ value, props }) =>
                        <div className={classes.manual.rowContainer} {...props}>
                            <div className={classes.manual.rowMovableIndicator}>
                                <svg height="21" width="5">
                                    <circle cx="2.5" cy="2.5" r="2.5" fill="#999" />
                                    <circle cx="2.5" cy="10.5" r="2.5" fill="#999" />
                                    <circle cx="2.5" cy="18.5" r="2.5" fill="#999" />
                                </svg>
                            </div>
                            <div>
                                <Selector
                                    choices={{
                                        node: {title: 'Node', value: 'node'},
                                        link: {title: 'Link', value: 'link', disabled: true}
                                    }}
                                    value={value.rule[0]}
                                    onClick={(event, choices, value) => handleRuleSelectorClick(event, 0, choices, value, props.key)}
                                />
                                <Selector
                                    ruleId={props.key}
                                    choices={{
                                        ofType: {title: 'of type', value: 'ofType'},
                                        labeled: {title: 'labeled', value: 'labeled', disabled: true},
                                        hasLink: {title: 'has link', value: 'hasLink', disabled: true},
                                        hasAttr: {title: 'has attribute', value: 'hasAttr', disabled: true},
                                        notApplicable: {title: 'not applicable to any rules', value: 'notApplicable'}
                                    }}
                                    value={value.rule[1]}
                                    onClick={(event, choices, value) => handleRuleSelectorClick(event, 1, choices, value, props.key)}
                                />
                                {value.rule[1] === 'ofType' ?
                                    <React.Fragment>
                                        <Entity value={value.values[0]} onClick={(event, value) => handleEntityClick(event, value, props.key, 0)} />
                                    </React.Fragment>
                                : value.rule[1] === 'hasLink' ?
                                    <React.Fragment>
                                        <button className={clsx([classes.form.block, classes.form.label])}>
                                            <span>of entity</span>
                                        </button>
                                        <Entity value={value.values[0]} onClick={(event, value) => handleEntityClick(event, value, props.key, 0)} />
                                        <button className={clsx([classes.form.block, classes.form.label])}>
                                            <span>to</span>
                                        </button>
                                        <Entity value={value.values[1]} onClick={(event, value) => handleEntityClick(event, value, props.key, 1)} />
                                    </React.Fragment>
                                : ''}
                            </div>
                            <div style={{paddingTop: 3}}>
                                <IconButton size="small" onClick={() => handleVisibilityClick(props.key)}>
                                    {value.visible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </div>
                            <div style={{paddingTop: 3}}>
                                {value.styles.icon === null ?
                                    <button 
                                        className={classes.manual.ruleStyleNone}
                                        onClick={() => onIconOpen(path => handleIconSelect(props.key, path))}
                                    />
                                :
                                    <IconButton 
                                        size="small" 
                                        onClick={() => onIconOpen(path => handleIconSelect(props.key, path))}
                                    >
                                        <svg viewBox="0 0 24 24" style={{width: 24, height: 24}}>
                                            <path 
                                                d={value.styles.icon}
                                            />
                                        </svg>
                                    </IconButton>
                                }
                            </div>
                            <div style={{paddingTop: 3}}>
                                <Tooltip title="Node Styles" arrow>
                                    <IconButton 
                                        size="small"
                                        style={{marginRight: 8}}
                                        onClick={event => handleNodeStyleClick(event, props.key)}
                                    >
                                        <NodeColorIcon 
                                            size={21}
                                            fill={convertRGBA(value.styles.node.backgroundColor)} 
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Label Styles" arrow>
                                    <IconButton 
                                        size="small" 
                                        onClick={event => handleLabelStyleClick(event, props.key)}
                                    >
                                        {value.styles.label.backgroundColor === null && value.styles.label.borderColor === null ?
                                            <div className={classes.manual.ruleStyleNone} />
                                        :
                                            <LabelBackgroundIcon 
                                                size={21}
                                                fill={convertRGBA(value.styles.label.backgroundColor)}
                                                stroke={convertRGBA(value.styles.label.fontColor)}
                                            />
                                        }
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <div className={classes.manual.ruleDeleteBlock}>
                                <IconButton aria-label="delete" size="small" className={classes.manual.ruleCopyButton}>
                                    <AddToPhotosIcon />
                                </IconButton>
                                <IconButton aria-label="delete" size="small" className={classes.manual.ruleDeleteButton}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        </div>
                    }
                />
            :
                <div className={classes.manual.ruleEmpty}>
                    No rules have been set.
                </div>
            }
            <div className={classes.manual.ruleAddContainer}>
                <div className={classes.manual.ruleAddBlock}>
                    <IconButton onClick={handleRuleAdd}>
                        <AddIcon className={classes.manual.ruleAddButton} />
                    </IconButton>
                </div>
            </div>
            <SelectorMenu
                selector={ruleSelector}
                onClose={handleRuleSelectorClose}
            />
            {Boolean(entitySelector) ?
                <EntitySearchPopover
                    selector={entitySelector}
                    onSelect={handleEntitySelect}
                    onClose={handleEntityClose}
                />
            : '' }
            {Boolean(colorSelector) ?
                <ColorPopover 
                    selector={colorSelector}
                    initColor={selectingId !== null ? toolReducer.rules.manual[selectingId].styles.nodeColor : {r: 0, g: 0, b: 0, a: 0}}
                />
            : '' }
            {Boolean(labelStyleSelector) ?
                <LabelStylePopover
                    selector={labelStyleSelector}
                    onSelect={handleLabelStyleSelect}
                    onClose={handleLabelStyleClose}
                    styles={selectingId !== null ? toolReducer.rules.manual[selectingId].styles.label : null}
                />
            : ''}
            {Boolean(nodeStyleSelector) ?
                <NodeStylePopover
                    selector={nodeStyleSelector}
                    onSelect={handleNodeStyleSelect}
                    onClose={handleNodeStyleClose}
                    styles={selectingId !== null ? toolReducer.rules.manual[selectingId].styles.node : null}
                />
            : ''}
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        reducers: {
            catalogs: state.catalogReducer,
            graphs: state.vizBaseGraphReducer
        }
    };
}

const mapDispatchToProps = dispatch => {
    return {
        actions: {
            graphs: {
                init: bindActionCreators(init, dispatch),
                updateTools: bindActionCreators(updateTools, dispatch)
            }
        }
    };
}

export const Rules = connect(mapStateToProps, mapDispatchToProps)(RulesClass);
