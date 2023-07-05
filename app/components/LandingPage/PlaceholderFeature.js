// REACT-REMIX IMPORTS
import { useState, useRef, useEffect } from "react";

import { redirect } from "@remix-run/node"
import { useLoaderData, useActionData, Form, useFetcher, useNavigate, useTransition, useSubmit, useRevalidator } from "@remix-run/react";
import { ClientOnly } from "remix-utils";
import ContentEditable from 'react-contenteditable';
import LinearProgress from '@mui/material/LinearProgress';
import useWebSocket, { ReadyState } from "react-use-websocket";

// MODULE IMPORTS
import { authenticator } from "~/models/auth.server.js";
import { readFeature, updateFeatureTitle, updateFeatureIsSearched, updateFeatureDescription } from "~/models/kanban.server"
import { findFeatureRequests, associateFeatureRequestsWithFeature } from "~/models/feature-requests.server"
import { embeddingSearch, generateSearchVector, initialiseClusterAnalysis } from "~/models/embedding-search.server"

import PlaceholderHeader from "~/components/LandingPage/PlaceholderHeader"
import OutletPlaceholder from "~/components/Feature/OutletPlaceholder";
import { ImSearch } from "react-icons/im"
import { Outlet, Link, useParams, useMatches } from "@remix-run/react";
import cn from 'classnames'
import MessageStream from "~/components/MessageStream/MessageStream.js"
import {IoIosArrowDropdown} from "react-icons/io"

import { GoTelescope } from 'react-icons/go'
import { BiNotepad } from 'react-icons/bi'
import Tooltip from '@mui/material/Tooltip';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import * as d3 from 'd3';
import PlaceholderDiscovery from "./PlaceholderDiscovery";
import PlaceholderNotepad from "./PlaceholderNotepad";

dayjs.extend(utc)


const loaderData = {
    feature: {
        "id": 49,
        "title": "Responsive Whiteboards",
        "description": "Hi this is my example description.",
        "userId": "110421822788553907926",
        "columnState": 2,
        "rankState": 1,
        "isSearched": true,
        "filters": [],
        "_count": {
            "featureRequests": 3
        }
    },
    featureRequests: [
        {
            "featureId": 49,
            "featureRequestId": "v9i1000412150541598832-3974107103761504501",
            "pinned": true,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.880756",
            "featureRequest": {
                "fr_id": "v9i1000412150541598832-3974107103761504501",
                "message_id": "1000412150541598832",
                "message": "create a new whiteboard from template",
                "created_at": "2022-07-23 14:40:43.448000+00:00",
                "author": "jam",
                "fr": "Create a new whiteboard from a template.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i1000981174539268236-8874274578705773815",
            "pinned": true,
            "clusterId": 250,
            "oldCluster": -1,
            "score": "0.83291775",
            "featureRequest": {
                "fr_id": "v9i1000981174539268236-8874274578705773815",
                "message_id": "1000981174539268236",
                "message": "<#856016076311101470> \nå¸ærecenter mapåè½å¯ä»¥ä¸æ¾å°whiteboardï¼æ¯ærecenter whiteboard",
                "created_at": "2022-07-25 04:21:49.341000+00:00",
                "author": "Skyline",
                "fr": "Add a 'Recenter Map' feature to the Whiteboard",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 250,
                "featureId": 49,
                "internalClusterId": 4,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 202,
                        "clusterId": 250,
                        "tagContent": "Map Navigation"
                    },
                    {
                        "clusterTagId": 203,
                        "clusterId": 250,
                        "tagContent": "User Control"
                    },
                    {
                        "clusterTagId": 204,
                        "clusterId": 250,
                        "tagContent": "Whiteboard Functionality"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i10009811745392682361945558427246778105",
            "pinned": true,
            "clusterId": 250,
            "oldCluster": -1,
            "score": "0.83291775",
            "featureRequest": {
                "fr_id": "v9i10009811745392682361945558427246778105",
                "message_id": "1000981174539268236",
                "message": "<#856016076311101470> \nå¸ærecenter mapåè½å¯ä»¥ä¸æ¾å°whiteboardï¼æ¯ærecenter whiteboard",
                "created_at": "2022-07-25 04:21:49.341000+00:00",
                "author": "Skyline",
                "fr": "Allow the Whiteboard to be recentered",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 250,
                "featureId": 49,
                "internalClusterId": 4,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 202,
                        "clusterId": 250,
                        "tagContent": "Map Navigation"
                    },
                    {
                        "clusterTagId": 203,
                        "clusterId": 250,
                        "tagContent": "User Control"
                    },
                    {
                        "clusterTagId": 204,
                        "clusterId": 250,
                        "tagContent": "Whiteboard Functionality"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i1001905019194458193-7597931175172313035",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.840248466",
            "featureRequest": {
                "fr_id": "v9i1001905019194458193-7597931175172313035",
                "message_id": "1001905019194458193",
                "message": "you probably mean whiteboards instead of map?\n\nbut yes, it would be useful to fold whiteboards and sub-whiteboards like toggle lists",
                "created_at": "2022-07-27 17:32:51.071000+00:00",
                "author": "jagar",
                "fr": "Add the ability to fold whiteboards and sub-whiteboards like toggle lists",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i1016033012674203718-5668007867967131344",
            "pinned": false,
            "clusterId": 248,
            "oldCluster": -1,
            "score": "0.843808234",
            "featureRequest": {
                "fr_id": "v9i1016033012674203718-5668007867967131344",
                "message_id": "1016033012674203718",
                "message": "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image.",
                "created_at": "2022-09-04 17:12:27.202000+00:00",
                "author": "jagar",
                "fr": "Allow users to easily make text bigger or smaller on whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 248,
                "featureId": 49,
                "internalClusterId": 3,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 196,
                        "clusterId": 248,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 197,
                        "clusterId": 248,
                        "tagContent": "Formatting"
                    },
                    {
                        "clusterTagId": 198,
                        "clusterId": 248,
                        "tagContent": "Scaling"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i10160330126742037181099371120237579059",
            "pinned": false,
            "clusterId": 248,
            "oldCluster": -1,
            "score": "0.843808234",
            "featureRequest": {
                "fr_id": "v9i10160330126742037181099371120237579059",
                "message_id": "1016033012674203718",
                "message": "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image.",
                "created_at": "2022-09-04 17:12:27.202000+00:00",
                "author": "jagar",
                "fr": "Allow users to easily change the format of text on whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 248,
                "featureId": 49,
                "internalClusterId": 3,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 196,
                        "clusterId": 248,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 197,
                        "clusterId": 248,
                        "tagContent": "Formatting"
                    },
                    {
                        "clusterTagId": 198,
                        "clusterId": 248,
                        "tagContent": "Scaling"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i10160330126742037183833512115516021409",
            "pinned": false,
            "clusterId": 248,
            "oldCluster": -1,
            "score": "0.843808234",
            "featureRequest": {
                "fr_id": "v9i10160330126742037183833512115516021409",
                "message_id": "1016033012674203718",
                "message": "we would have a much greater series of options to visually customize our whiteboards because currently we cannot easily make the text bigger or smaller (and in different formats) as per our needs.\n\nsame with the images, but less, since you can scale the card that shows an image.",
                "created_at": "2022-09-04 17:12:27.202000+00:00",
                "author": "jagar",
                "fr": "Allow users to easily scale images on whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 248,
                "featureId": 49,
                "internalClusterId": 3,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 196,
                        "clusterId": 248,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 197,
                        "clusterId": 248,
                        "tagContent": "Formatting"
                    },
                    {
                        "clusterTagId": 198,
                        "clusterId": 248,
                        "tagContent": "Scaling"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i10189826926557266722342554084651943889",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.838070691",
            "featureRequest": {
                "fr_id": "v9i10189826926557266722342554084651943889",
                "message_id": "1018982692655726672",
                "message": "create a new card by clicking in empty space in whiteboard when using the whiteboard app",
                "created_at": "2022-09-12 20:33:25.712000+00:00",
                "author": "maxlinworm",
                "fr": "Create a new card by clicking in empty space in the whiteboard when using the whiteboard app.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8588993255263437013113349540530104066",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.849119663",
            "featureRequest": {
                "fr_id": "v9i8588993255263437013113349540530104066",
                "message_id": "858899325526343701",
                "message": "what if a card have different colors in different whiteboard?",
                "created_at": "2021-06-28 02:39:16.783000+00:00",
                "author": "Alan Chan",
                "fr": "Allow cards to have different colors in different whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i859168772543610900-7930194191450590066",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.831413",
            "featureRequest": {
                "fr_id": "v9i859168772543610900-7930194191450590066",
                "message_id": "859168772543610900",
                "message": "but then that brings us to another possible feature!  \"this card is used on multiple whiteboards\" ! lol",
                "created_at": "2021-06-28 20:29:57.958000+00:00",
                "author": "Sams_Here",
                "fr": "Add a feature that allows a card to be used on multiple whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8632867280174448942567495592888170413",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.844596326",
            "featureRequest": {
                "fr_id": "v9i8632867280174448942567495592888170413",
                "message_id": "863286728017444894",
                "message": "----\n\nthe thing that would be powerful for thinking out loud for me is if i could have multiple panes. so here multiple white boards",
                "created_at": "2021-07-10 05:13:15.051000+00:00",
                "author": "The_Badjer",
                "fr": "Allow users to have multiple white boards in the thinking out loud feature",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8632867280174448943449401118398430737",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.844596326",
            "featureRequest": {
                "fr_id": "v9i8632867280174448943449401118398430737",
                "message_id": "863286728017444894",
                "message": "----\n\nthe thing that would be powerful for thinking out loud for me is if i could have multiple panes. so here multiple white boards",
                "created_at": "2021-07-10 05:13:15.051000+00:00",
                "author": "The_Badjer",
                "fr": "Provide the ability to have multiple panes in the thinking out loud feature",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i863432664723095632-1549201269655352386",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.822029114",
            "featureRequest": {
                "fr_id": "v9i863432664723095632-1549201269655352386",
                "message_id": "863432664723095632",
                "message": "feature request: i think we're at a point where users will need a mouse-over title (pop-up) for the icons along the top (right) on the all cards view. [ looks like you have mouse-over working when a whiteboard is open]",
                "created_at": "2021-07-10 14:53:09.073000+00:00",
                "author": "Sams_Here",
                "fr": "Enable mouse-over when a whiteboard is open.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i863432664723095632-8467884391115163503",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.822029114",
            "featureRequest": {
                "fr_id": "v9i863432664723095632-8467884391115163503",
                "message_id": "863432664723095632",
                "message": "feature request: i think we're at a point where users will need a mouse-over title (pop-up) for the icons along the top (right) on the all cards view. [ looks like you have mouse-over working when a whiteboard is open]",
                "created_at": "2021-07-10 14:53:09.073000+00:00",
                "author": "Sams_Here",
                "fr": "Add a mouse-over title (pop-up) for the icons along the top (right) on the all cards view.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8725517861484052684313145215605523355",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.816303968",
            "featureRequest": {
                "fr_id": "v9i8725517861484052684313145215605523355",
                "message_id": "872551786148405268",
                "message": "fr: what if we could title our color circles per whiteboard.  so that way when we choose the color palette, we can see what we named them?  maybe on hover?",
                "created_at": "2021-08-04 18:49:17.046000+00:00",
                "author": "Sams_Here",
                "fr": "Allow users to title color circles on whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8866125231372615996077431552715567718",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.824992657",
            "featureRequest": {
                "fr_id": "v9i8866125231372615996077431552715567718",
                "message_id": "886612523137261599",
                "message": "is there any way or keyboard shortcut to move the screen to the same card but of different place? (under the same whiteboard)",
                "created_at": "2021-09-12 14:01:37.980000+00:00",
                "author": "YZ",
                "fr": "Add a keyboard shortcut to move the screen to a different place under the same whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i886630868309913600-89965889925947922",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.828018308",
            "featureRequest": {
                "fr_id": "v9i886630868309913600-89965889925947922",
                "message_id": "886630868309913600",
                "message": "maybe someday, when whiteboards are shared, the tutorial can be presented in that way and shipped/updated when new updates are released.  on that note... will there be an option to lock a whiteboard or cards from editing by another user?",
                "created_at": "2021-09-12 15:14:31.810000+00:00",
                "author": "Sams_Here",
                "fr": "Add an option to lock a whiteboard or cards from editing by another user.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8886406484067942828824202936482738028",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.861635625",
            "featureRequest": {
                "fr_id": "v9i8886406484067942828824202936482738028",
                "message_id": "888640648406794282",
                "message": "well, here i mean 'search to navigate cards in whiteboard'",
                "created_at": "2021-09-18 04:20:40.725000+00:00",
                "author": "Alan Chan",
                "fr": "Allow users to search for cards in the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i888642569205075999-7839370079637875286",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.85125488",
            "featureRequest": {
                "fr_id": "v9i888642569205075999-7839370079637875286",
                "message_id": "888642569205075999",
                "message": "but a card can appear in many whiteboards, how do we decide which whiteboard to navigate to?",
                "created_at": "2021-09-18 04:28:18.679000+00:00",
                "author": "Alan Chan",
                "fr": "Allow users to select which whiteboard to navigate to when a card appears in multiple whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8891930685180559368439953573465622513",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.850169957",
            "featureRequest": {
                "fr_id": "v9i8891930685180559368439953573465622513",
                "message_id": "889193068518055936",
                "message": "actually we have another plan for that 'active whiteboard'. in the future, it will become 'active whiteboard**s**', which is kind of like tabs, where you can open multiple whiteboards on the sidebar and quickly switch among them instead of constantly go back to home to choose the whiteboard you want to go to.",
                "created_at": "2021-09-19 16:55:47.943000+00:00",
                "author": "Alan Chan",
                "fr": "Allow users to open multiple whiteboards on the sidebar and quickly switch among them without having to go back to the home page",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8891930685180559368457441102961042322",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.850169957",
            "featureRequest": {
                "fr_id": "v9i8891930685180559368457441102961042322",
                "message_id": "889193068518055936",
                "message": "actually we have another plan for that 'active whiteboard'. in the future, it will become 'active whiteboard**s**', which is kind of like tabs, where you can open multiple whiteboards on the sidebar and quickly switch among them instead of constantly go back to home to choose the whiteboard you want to go to.",
                "created_at": "2021-09-19 16:55:47.943000+00:00",
                "author": "Alan Chan",
                "fr": "Add a feature to the active whiteboard that allows users to open multiple whiteboards on the sidebar and quickly switch among them",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i8983031956867687907475350355654023676",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.824072659",
            "featureRequest": {
                "fr_id": "v9i8983031956867687907475350355654023676",
                "message_id": "898303195686768790",
                "message": "welp, i know it's on the *roadmap*, but i just found myself wanting to import one whiteboard into another whiteboard. however in my instance, i tried clicking/dragging a whiteboard onto a target whiteboard from the home view screen. there ya have it!",
                "created_at": "2021-10-14 20:16:11.518000+00:00",
                "author": "Sams_Here",
                "fr": "Allow users to import one whiteboard into another whiteboard by clicking/dragging a whiteboard onto a target whiteboard from the home view screen.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i906531438256619530216715807111100399",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.82090193",
            "featureRequest": {
                "fr_id": "v9i906531438256619530216715807111100399",
                "message_id": "906531438256619530",
                "message": "fr: search card in a whiteboard with a alfred-like search bar (i found this screenshot of an old feature on the roadmap) and bind it with a shortcut key",
                "created_at": "2021-11-06 13:12:17.420000+00:00",
                "author": "imalightbulb",
                "fr": "Allow users to bind a shortcut key to the search card",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9065314382566195308236624167437561681",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.82090193",
            "featureRequest": {
                "fr_id": "v9i9065314382566195308236624167437561681",
                "message_id": "906531438256619530",
                "message": "fr: search card in a whiteboard with a alfred-like search bar (i found this screenshot of an old feature on the roadmap) and bind it with a shortcut key",
                "created_at": "2021-11-06 13:12:17.420000+00:00",
                "author": "imalightbulb",
                "fr": "Add a search card to a whiteboard with an Alfred-like search bar",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9083860068504822278762902185216189707",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.824815333",
            "featureRequest": {
                "fr_id": "v9i9083860068504822278762902185216189707",
                "message_id": "908386006850482227",
                "message": "fr about local image: directly drag images to whiteboard and create one note for one image would be awesome",
                "created_at": "2021-11-11 16:01:41.029000+00:00",
                "author": "YZ",
                "fr": "Allow users to directly drag images to the whiteboard and create one note for each image.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9232414874608804251038723565890192941",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.81915468",
            "featureRequest": {
                "fr_id": "v9i9232414874608804251038723565890192941",
                "message_id": "923241487460880425",
                "message": "ad whiteboard: add a button / shortcut: \"bring me into the center of the canvas\". i have got lost in one moment and it was difficult to find my cards again.",
                "created_at": "2021-12-22 15:52:03.608000+00:00",
                "author": "Cato Minor",
                "fr": "Add a button or shortcut to bring the user to the center of the canvas.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i928672439876071434-6624365120613029743",
            "pinned": false,
            "clusterId": 248,
            "oldCluster": -1,
            "score": "0.829884589",
            "featureRequest": {
                "fr_id": "v9i928672439876071434-6624365120613029743",
                "message_id": "928672439876071434",
                "message": "a little but useful thing: what about adding possibility for a transparent background? it would be great for using images on whiteboards.",
                "created_at": "2022-01-06 15:32:43.566000+00:00",
                "author": "Cato Minor",
                "fr": "Add the possibility for a transparent background",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 248,
                "featureId": 49,
                "internalClusterId": 3,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 196,
                        "clusterId": 248,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 197,
                        "clusterId": 248,
                        "tagContent": "Formatting"
                    },
                    {
                        "clusterTagId": 198,
                        "clusterId": 248,
                        "tagContent": "Scaling"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9286724398760714348823090168648976551",
            "pinned": false,
            "clusterId": 248,
            "oldCluster": -1,
            "score": "0.829884589",
            "featureRequest": {
                "fr_id": "v9i9286724398760714348823090168648976551",
                "message_id": "928672439876071434",
                "message": "a little but useful thing: what about adding possibility for a transparent background? it would be great for using images on whiteboards.",
                "created_at": "2022-01-06 15:32:43.566000+00:00",
                "author": "Cato Minor",
                "fr": "Allow images to be used on whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 248,
                "featureId": 49,
                "internalClusterId": 3,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 196,
                        "clusterId": 248,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 197,
                        "clusterId": 248,
                        "tagContent": "Formatting"
                    },
                    {
                        "clusterTagId": 198,
                        "clusterId": 248,
                        "tagContent": "Scaling"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9340445801296814498197419815358872674",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.822098374",
            "featureRequest": {
                "fr_id": "v9i9340445801296814498197419815358872674",
                "message_id": "934044580129681449",
                "message": "can a card be added to a whiteboard while creating it in timeline view?",
                "created_at": "2022-01-21 11:19:41.612000+00:00",
                "author": "an",
                "fr": "Add a card to a whiteboard while creating it in timeline view.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i934579243281686538-1217347962359031949",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.81972909",
            "featureRequest": {
                "fr_id": "v9i934579243281686538-1217347962359031949",
                "message_id": "934579243281686538",
                "message": "yea. it would be nice to have create commands while in the whiteboard to be able to capture information using keyboard only.",
                "created_at": "2022-01-22 22:44:15.241000+00:00",
                "author": "an",
                "fr": "Create commands in the whiteboard to capture information using keyboard only.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i934957811539017870-5376192812733775249",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.82529676",
            "featureRequest": {
                "fr_id": "v9i934957811539017870-5376192812733775249",
                "message_id": "934957811539017870",
                "message": "would love the possibility to copy paste tweets on the whiteboards which would create a card with an embed of the tweet. would allow for a nice way to organize tweets visually",
                "created_at": "2022-01-23 23:48:32.947000+00:00",
                "author": "nm",
                "fr": "Allow users to copy and paste tweets onto whiteboards to create a card with an embedded tweet.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9349578115390178707349003484989027213",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.82529676",
            "featureRequest": {
                "fr_id": "v9i9349578115390178707349003484989027213",
                "message_id": "934957811539017870",
                "message": "would love the possibility to copy paste tweets on the whiteboards which would create a card with an embed of the tweet. would allow for a nice way to organize tweets visually",
                "created_at": "2022-01-23 23:48:32.947000+00:00",
                "author": "nm",
                "fr": "Provide a way to organize tweets visually on whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i937832134352179280-8033554301159673783",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.828298628",
            "featureRequest": {
                "fr_id": "v9i937832134352179280-8033554301159673783",
                "message_id": "937832134352179280",
                "message": "this, i think maps for different areas would be super valuable. product development for instance can have many whiteboards per project with many cards within each whiteboard.",
                "created_at": "2022-01-31 22:10:04.908000+00:00",
                "author": "d3",
                "fr": "Add maps for different areas",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9378321343521792801781771928292062579",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.828298628",
            "featureRequest": {
                "fr_id": "v9i9378321343521792801781771928292062579",
                "message_id": "937832134352179280",
                "message": "this, i think maps for different areas would be super valuable. product development for instance can have many whiteboards per project with many cards within each whiteboard.",
                "created_at": "2022-01-31 22:10:04.908000+00:00",
                "author": "d3",
                "fr": "Allow product development to have multiple whiteboards per project with multiple cards within each whiteboard",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i942074703495958528-4682367549355637026",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.864023685",
            "featureRequest": {
                "fr_id": "v9i942074703495958528-4682367549355637026",
                "message_id": "942074703495958528",
                "message": "how hard would it be to make it to where you can have a whiteboard within a whiteboard?",
                "created_at": "2022-02-12 15:08:32.215000+00:00",
                "author": "Ambitendency",
                "fr": "Add a feature that allows users to create a whiteboard within a whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i942074857443688519-3990171348895352703",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.848387837",
            "featureRequest": {
                "fr_id": "v9i942074857443688519-3990171348895352703",
                "message_id": "942074857443688519",
                "message": "like i would love if i could add a whiteboard inside another next to other cards so i could further group content",
                "created_at": "2022-02-12 15:09:08.919000+00:00",
                "author": "Ambitendency",
                "fr": "Allow further grouping of content with whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i942074857443688519119220853266003850",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.848376393",
            "featureRequest": {
                "fr_id": "v9i942074857443688519119220853266003850",
                "message_id": "942074857443688519",
                "message": "like i would love if i could add a whiteboard inside another next to other cards so i could further group content",
                "created_at": "2022-02-12 15:09:08.919000+00:00",
                "author": "Ambitendency",
                "fr": "Add a whiteboard inside another next to other cards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i948698229627818014-9079007417502241355",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.829748392",
            "featureRequest": {
                "fr_id": "v9i948698229627818014-9079007417502241355",
                "message_id": "948698229627818014",
                "message": "i would love to have an option to one-click clean up the layout of the cards on the whiteboard.",
                "created_at": "2022-03-02 21:48:03.904000+00:00",
                "author": "sundar",
                "fr": "Add an option to one-click clean up the layout of the cards on the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i950439752505651230-3426220155983086937",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.840385616",
            "featureRequest": {
                "fr_id": "v9i950439752505651230-3426220155983086937",
                "message_id": "950439752505651230",
                "message": "or, can we have a vertical list of whiteboards on the left sidebar, and have a horizontal list of cards on the topbar?",
                "created_at": "2022-03-07 17:08:15.314000+00:00",
                "author": "catphys",
                "fr": "Add a vertical list of whiteboards to the left sidebar",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i950439752505651230-629965317614427405",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.840281665",
            "featureRequest": {
                "fr_id": "v9i950439752505651230-629965317614427405",
                "message_id": "950439752505651230",
                "message": "or, can we have a vertical list of whiteboards on the left sidebar, and have a horizontal list of cards on the topbar?",
                "created_at": "2022-03-07 17:08:15.314000+00:00",
                "author": "catphys",
                "fr": "Add a horizontal list of cards to the topbar",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i951122689744060446-2165943647820470244",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.835097611",
            "featureRequest": {
                "fr_id": "v9i951122689744060446-2165943647820470244",
                "message_id": "951122689744060446",
                "message": "card alignment tools.  right now, i am eyeballing cards to make sure they look consistent with others both in terms of card size and vertical and horizontal alignment.  these tools will ensure a cleaner whiteboard overall.",
                "created_at": "2022-03-09 14:22:00.240000+00:00",
                "author": "nbert217",
                "fr": "Provide card alignment tools to ensure consistent card size and vertical and horizontal alignment on the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i951432343481122846-6180523272900430997",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.823856056",
            "featureRequest": {
                "fr_id": "v9i951432343481122846-6180523272900430997",
                "message_id": "951432343481122846",
                "message": "feature request: easy organize card hotkey in whiteboard, for example, align top, like figma",
                "created_at": "2022-03-10 10:52:27.444000+00:00",
                "author": "bestony.eth",
                "fr": "Create a hotkey in the whiteboard to easily organize cards, such as aligning them to the top, similar to Figma.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i953259547726860288-2843118837237454292",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.837127626",
            "featureRequest": {
                "fr_id": "v9i953259547726860288-2843118837237454292",
                "message_id": "953259547726860288",
                "message": "landing (index) card or starting view for published whiteboards",
                "created_at": "2022-03-15 11:53:06.884000+00:00",
                "author": "ÃaÄlar O",
                "fr": "Add a landing card or starting view for published whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9532597345956741739214348505444256000",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.849568188",
            "featureRequest": {
                "fr_id": "v9i9532597345956741739214348505444256000",
                "message_id": "953259734595674173",
                "message": "or onboarding for the first time viewers for published whiteboards",
                "created_at": "2022-03-15 11:53:51.437000+00:00",
                "author": "ÃaÄlar O",
                "fr": "Provide an onboarding process for first time viewers of published whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i953318516524724274422889199156208785",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.821894348",
            "featureRequest": {
                "fr_id": "v9i953318516524724274422889199156208785",
                "message_id": "953318516524724274",
                "message": "can we add a search (magnifier) on maps similar to whiteboards? while it's fun to use visual cue to remember where i position a whiteboard on maps, for new whiteboards that i am not sure where to put them on the map yet i find it hard and need to resort to visual scanning to look for whiteboards.",
                "created_at": "2022-03-15 15:47:26.141000+00:00",
                "author": "cyb3rm4x",
                "fr": "Allow users to easily locate whiteboards on maps without having to resort to visual scanning.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9533185165247242747094256610404363493",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.821894348",
            "featureRequest": {
                "fr_id": "v9i9533185165247242747094256610404363493",
                "message_id": "953318516524724274",
                "message": "can we add a search (magnifier) on maps similar to whiteboards? while it's fun to use visual cue to remember where i position a whiteboard on maps, for new whiteboards that i am not sure where to put them on the map yet i find it hard and need to resort to visual scanning to look for whiteboards.",
                "created_at": "2022-03-15 15:47:26.141000+00:00",
                "author": "cyb3rm4x",
                "fr": "Add a search (magnifier) on maps similar to whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i953360867959906384-6067793731390907988",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.818345785",
            "featureRequest": {
                "fr_id": "v9i953360867959906384-6067793731390907988",
                "message_id": "953360867959906384",
                "message": "fr: similar to other _fit to content_ additions, can this also be added in the map view for each whiteboard (within the three-dot menu)?",
                "created_at": "2022-03-15 18:35:43.510000+00:00",
                "author": "Sams_Here",
                "fr": "Add a 'Fit to Content' option to the three-dot menu in the map view for each whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i958320627234775061-423534194539914412",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.83850944",
            "featureRequest": {
                "fr_id": "v9i958320627234775061-423534194539914412",
                "message_id": "958320627234775061",
                "message": "feature request: duplicate option to clone a whiteboard",
                "created_at": "2022-03-29 11:04:02.269000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Add a duplicate option to clone a whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i958326031444475904-8257322508866585360",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.818192482",
            "featureRequest": {
                "fr_id": "v9i958326031444475904-8257322508866585360",
                "message_id": "958326031444475904",
                "message": "feature request:  an option to get emoj icon for card in whiteboard for improved noticibility.   similar to page icon in notion",
                "created_at": "2022-03-29 11:25:30.733000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Add an option to get an emoji icon for cards in whiteboard for improved noticibility.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9583260314444759047212185770002520442",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.818196237",
            "featureRequest": {
                "fr_id": "v9i9583260314444759047212185770002520442",
                "message_id": "958326031444475904",
                "message": "feature request:  an option to get emoj icon for card in whiteboard for improved noticibility.   similar to page icon in notion",
                "created_at": "2022-03-29 11:25:30.733000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Add a page icon in Notion similar to the one in Notion.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i958648573082349568-8938506535428423672",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.829209387",
            "featureRequest": {
                "fr_id": "v9i958648573082349568-8938506535428423672",
                "message_id": "958648573082349568",
                "message": "feature request: automatic whiteboard generation with pre-drawn connections (single / bi direction) ref: https://discord.com/channels/812292969183969301/868431744699867146/958578151343157249",
                "created_at": "2022-03-30 08:47:10.652000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Generate an automatic whiteboard with pre-drawn connections in both single and bi-directional directions.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i959466934640971785-6884165769056186807",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.829056859",
            "featureRequest": {
                "fr_id": "v9i959466934640971785-6884165769056186807",
                "message_id": "959466934640971785",
                "message": "feature request:  press 5 or shortcut key assigned to view the whiteboard in lowest zoom out view to see entire whiteboard",
                "created_at": "2022-04-01 14:59:03.252000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Assign a shortcut key to view the whiteboard in the lowest zoom out view to see the entire whiteboard",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i959466934640971785-6936337664864962965",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.829056859",
            "featureRequest": {
                "fr_id": "v9i959466934640971785-6936337664864962965",
                "message_id": "959466934640971785",
                "message": "feature request:  press 5 or shortcut key assigned to view the whiteboard in lowest zoom out view to see entire whiteboard",
                "created_at": "2022-04-01 14:59:03.252000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Press 5 to view the whiteboard in the lowest zoom out view to see the entire whiteboard",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9613984312707236772468437257103050801",
            "pinned": false,
            "clusterId": 245,
            "oldCluster": -1,
            "score": "0.855827093",
            "featureRequest": {
                "fr_id": "v9i9613984312707236772468437257103050801",
                "message_id": "961398431270723677",
                "message": "fr: whiteboard: summary arrow",
                "created_at": "2022-04-06 22:54:07.934000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Add a whiteboard feature",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 245,
                "featureId": 49,
                "internalClusterId": 2,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 187,
                        "clusterId": 245,
                        "tagContent": "Whiteboard Functionality"
                    },
                    {
                        "clusterTagId": 188,
                        "clusterId": 245,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 189,
                        "clusterId": 245,
                        "tagContent": "Visibility"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9613984312707236773770679555983962340",
            "pinned": false,
            "clusterId": 245,
            "oldCluster": -1,
            "score": "0.855827093",
            "featureRequest": {
                "fr_id": "v9i9613984312707236773770679555983962340",
                "message_id": "961398431270723677",
                "message": "fr: whiteboard: summary arrow",
                "created_at": "2022-04-06 22:54:07.934000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Add a summary arrow feature",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 245,
                "featureId": 49,
                "internalClusterId": 2,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 187,
                        "clusterId": 245,
                        "tagContent": "Whiteboard Functionality"
                    },
                    {
                        "clusterTagId": 188,
                        "clusterId": 245,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 189,
                        "clusterId": 245,
                        "tagContent": "Visibility"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i961403308826820609-7920739415187932502",
            "pinned": false,
            "clusterId": 245,
            "oldCluster": -1,
            "score": "0.818285644",
            "featureRequest": {
                "fr_id": "v9i961403308826820609-7920739415187932502",
                "message_id": "961403308826820609",
                "message": "fr: whiteboard: archive  (use case: suited for one-off projects / old research as and when our life goes to next topic/area of focus. idea: archived whiteboards are hidden from map view.    users who want to see archived boards can click a icon to see all whiteboards in map view. ) thank you",
                "created_at": "2022-04-06 23:13:30.834000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Provide an icon to view all whiteboards in the map view",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 245,
                "featureId": 49,
                "internalClusterId": 2,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 187,
                        "clusterId": 245,
                        "tagContent": "Whiteboard Functionality"
                    },
                    {
                        "clusterTagId": 188,
                        "clusterId": 245,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 189,
                        "clusterId": 245,
                        "tagContent": "Visibility"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9614033088268206094356493750907799299",
            "pinned": false,
            "clusterId": 245,
            "oldCluster": -1,
            "score": "0.818285644",
            "featureRequest": {
                "fr_id": "v9i9614033088268206094356493750907799299",
                "message_id": "961403308826820609",
                "message": "fr: whiteboard: archive  (use case: suited for one-off projects / old research as and when our life goes to next topic/area of focus. idea: archived whiteboards are hidden from map view.    users who want to see archived boards can click a icon to see all whiteboards in map view. ) thank you",
                "created_at": "2022-04-06 23:13:30.834000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Allow users to archive whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 245,
                "featureId": 49,
                "internalClusterId": 2,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 187,
                        "clusterId": 245,
                        "tagContent": "Whiteboard Functionality"
                    },
                    {
                        "clusterTagId": 188,
                        "clusterId": 245,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 189,
                        "clusterId": 245,
                        "tagContent": "Visibility"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i961403308826820609746178063220817756",
            "pinned": false,
            "clusterId": 245,
            "oldCluster": -1,
            "score": "0.818285644",
            "featureRequest": {
                "fr_id": "v9i961403308826820609746178063220817756",
                "message_id": "961403308826820609",
                "message": "fr: whiteboard: archive  (use case: suited for one-off projects / old research as and when our life goes to next topic/area of focus. idea: archived whiteboards are hidden from map view.    users who want to see archived boards can click a icon to see all whiteboards in map view. ) thank you",
                "created_at": "2022-04-06 23:13:30.834000+00:00",
                "author": "ááá¬á¸áá±á·áá¬áá°",
                "fr": "Hide archived whiteboards from the map view",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 245,
                "featureId": 49,
                "internalClusterId": 2,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 187,
                        "clusterId": 245,
                        "tagContent": "Whiteboard Functionality"
                    },
                    {
                        "clusterTagId": 188,
                        "clusterId": 245,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 189,
                        "clusterId": 245,
                        "tagContent": "Visibility"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9619661052980798141717379019770373262",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.844642937",
            "featureRequest": {
                "fr_id": "v9i9619661052980798141717379019770373262",
                "message_id": "961966105298079814",
                "message": "fr: it would be great to have a button in whiteboard, that automatically adjust the view into one able to see all of cards in the whiteboard. for example in my screenshots, from view 1 to view 2.",
                "created_at": "2022-04-08 12:29:51.969000+00:00",
                "author": "alphonse.yc",
                "fr": "Add a button to the whiteboard that automatically adjusts the view to show all cards in the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i965104289309659176-3357130847522226069",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.819708228",
            "featureRequest": {
                "fr_id": "v9i965104289309659176-3357130847522226069",
                "message_id": "965104289309659176",
                "message": "would love to have organizing functions for the \"working tabs\" side bar (similar to the style for notion and notability, with subject and notes) so we could have several white boards under one category. also, it'd be great to have this along with whiteboards embedded within whiteboards.",
                "created_at": "2022-04-17 04:19:53.342000+00:00",
                "author": "TerryChen",
                "fr": "Add organizing functions for the 'working tabs' side bar similar to the style for Notion and Notability, with subject and notes.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i965104289309659176-4200600213147602282",
            "pinned": false,
            "clusterId": 246,
            "oldCluster": -1,
            "score": "0.819708228",
            "featureRequest": {
                "fr_id": "v9i965104289309659176-4200600213147602282",
                "message_id": "965104289309659176",
                "message": "would love to have organizing functions for the \"working tabs\" side bar (similar to the style for notion and notability, with subject and notes) so we could have several white boards under one category. also, it'd be great to have this along with whiteboards embedded within whiteboards.",
                "created_at": "2022-04-17 04:19:53.342000+00:00",
                "author": "TerryChen",
                "fr": "Allow white boards to be embedded within white boards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 246,
                "featureId": 49,
                "internalClusterId": 5,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 190,
                        "clusterId": 246,
                        "tagContent": "Multiple Whiteboards"
                    },
                    {
                        "clusterTagId": 191,
                        "clusterId": 246,
                        "tagContent": "Organizing Functions"
                    },
                    {
                        "clusterTagId": 192,
                        "clusterId": 246,
                        "tagContent": "Quick Switching"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i968317798583517275-8528516142018980886",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.883067131",
            "featureRequest": {
                "fr_id": "v9i968317798583517275-8528516142018980886",
                "message_id": "968317798583517275",
                "message": "search a  title of a specific whiteboard",
                "created_at": "2022-04-26 01:09:13.657000+00:00",
                "author": "Saad C",
                "fr": "Allow users to search for a specific whiteboard by title.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9689967757572464748422740270750591911",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.829431355",
            "featureRequest": {
                "fr_id": "v9i9689967757572464748422740270750591911",
                "message_id": "968996775757246474",
                "message": "i recently have shown a lot of my whiteboards to people, and i got some new ideas. i'm wondering wheather we can have a \"present\" mode for a whiteboard. like, i can set the \"present order\" of  cards and arrows inside that whiteboard. and when i show that whiteboard to others, i can show them \"card by card\" and let them easily follow my thoughts.  in other words, showing how my idea grows. just like \"animation\" in powerpoint, but just \"appear by order\".",
                "created_at": "2022-04-27 22:07:14.430000+00:00",
                "author": "z95z",
                "fr": "Add a 'present' mode for a whiteboard, allowing users to set the 'present order' of cards and arrows inside the whiteboard and show them 'card by card' to others, like an animation in PowerPoint",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i971511227018780682-2539056629151978395",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.832182884",
            "featureRequest": {
                "fr_id": "v9i971511227018780682-2539056629151978395",
                "message_id": "971511227018780682",
                "message": "would like more \"snap to grid\" on the whiteboard, to make it easier to line up cards not right next to each other, think something like what whimsical or draw.io or canva would do with objects nearby (showing grid lines).",
                "created_at": "2022-05-04 20:38:46.327000+00:00",
                "author": "Quantumhair",
                "fr": "Display grid lines when objects are nearby, similar to what whimsical, draw.io, or Canva do.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9715112270187806825671370982995165213",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.832182884",
            "featureRequest": {
                "fr_id": "v9i9715112270187806825671370982995165213",
                "message_id": "971511227018780682",
                "message": "would like more \"snap to grid\" on the whiteboard, to make it easier to line up cards not right next to each other, think something like what whimsical or draw.io or canva would do with objects nearby (showing grid lines).",
                "created_at": "2022-05-04 20:38:46.327000+00:00",
                "author": "Quantumhair",
                "fr": "Add 'snap to grid' functionality to the whiteboard to make it easier to line up cards not right next to each other.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9733354239779308123399159052463518229",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.825775",
            "featureRequest": {
                "fr_id": "v9i9733354239779308123399159052463518229",
                "message_id": "973335423977930812",
                "message": "can we add \"add to whiteboard\" in the ... menu for the card on the whiteboard? right now this requires users to open a sidepane and click the ... menu on the card in the sidepane, which adds friction for reusing card across whiteboards.",
                "created_at": "2022-05-09 21:27:28.774000+00:00",
                "author": "cyb3rm4x",
                "fr": "Allow users to reuse cards across whiteboards without having to open a sidepane and click the menu on the card in the sidepane.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9733354239779308124357090596369897543",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.825775",
            "featureRequest": {
                "fr_id": "v9i9733354239779308124357090596369897543",
                "message_id": "973335423977930812",
                "message": "can we add \"add to whiteboard\" in the ... menu for the card on the whiteboard? right now this requires users to open a sidepane and click the ... menu on the card in the sidepane, which adds friction for reusing card across whiteboards.",
                "created_at": "2022-05-09 21:27:28.774000+00:00",
                "author": "cyb3rm4x",
                "fr": "Add 'Add to Whiteboard' to the menu for the card on the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9765958500106895576351801068787818604",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.827354",
            "featureRequest": {
                "fr_id": "v9i9765958500106895576351801068787818604",
                "message_id": "976595850010689557",
                "message": "would love to be able to duplicate whiteboards.\n\nsometimes i want to experiment with a new arrangement / order of the same set of cards, which i could do in a fresh copy, without changing the current way i have things organized (which i would leave in the original).",
                "created_at": "2022-05-18 21:23:14.916000+00:00",
                "author": "josh stark",
                "fr": "Allow users to duplicate whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9765958500106895576881410630656670997",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.827354",
            "featureRequest": {
                "fr_id": "v9i9765958500106895576881410630656670997",
                "message_id": "976595850010689557",
                "message": "would love to be able to duplicate whiteboards.\n\nsometimes i want to experiment with a new arrangement / order of the same set of cards, which i could do in a fresh copy, without changing the current way i have things organized (which i would leave in the original).",
                "created_at": "2022-05-18 21:23:14.916000+00:00",
                "author": "josh stark",
                "fr": "Allow users to create a fresh copy of a whiteboard without changing the original.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9766080884151747262149597290080607332",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.854052067",
            "featureRequest": {
                "fr_id": "v9i9766080884151747262149597290080607332",
                "message_id": "976608088415174726",
                "message": "your idea of duplicating a whiteboard might tie in nicely with a whiteboard _template_ which could be created with a specific spacing/layout - with blank card placeholders - that could be re-used (?)",
                "created_at": "2022-05-18 22:11:52.779000+00:00",
                "author": "Sams_Here",
                "fr": "Allow users to duplicate a whiteboard",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9766080884151747266741896142533261088",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.854066133",
            "featureRequest": {
                "fr_id": "v9i9766080884151747266741896142533261088",
                "message_id": "976608088415174726",
                "message": "your idea of duplicating a whiteboard might tie in nicely with a whiteboard _template_ which could be created with a specific spacing/layout - with blank card placeholders - that could be re-used (?)",
                "created_at": "2022-05-18 22:11:52.779000+00:00",
                "author": "Sams_Here",
                "fr": "Create a whiteboard template with specific spacing/layout and blank card placeholders",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9782035040007946653688398659674321763",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.840598464",
            "featureRequest": {
                "fr_id": "v9i9782035040007946653688398659674321763",
                "message_id": "978203504000794665",
                "message": "since hepta supports sharing of a whiteboard i wonder if commenting (anyone with link) on published whiteboard is on the road map?",
                "created_at": "2022-05-23 07:51:29.496000+00:00",
                "author": "Charles Windlin (KTH)",
                "fr": "Add a feature that allows anyone with a link to comment on a published whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9790463791565619315266020516179414203",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.859334528",
            "featureRequest": {
                "fr_id": "v9i9790463791565619315266020516179414203",
                "message_id": "979046379156561931",
                "message": "would love to be able to reference whiteboards in text (e.g. thru an @whiteboard)",
                "created_at": "2022-05-25 15:40:46.593000+00:00",
                "author": "josh stark",
                "fr": "Allow users to reference whiteboards in text using the @whiteboard syntax.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9794910846673551585055052390841909349",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.836475194",
            "featureRequest": {
                "fr_id": "v9i9794910846673551585055052390841909349",
                "message_id": "979491084667355158",
                "message": "on the touch screen of the laptop, can i use two fingers to zoom in and out on the whiteboard?",
                "created_at": "2022-05-26 21:07:52.649000+00:00",
                "author": "catphys",
                "fr": "Allow two-finger zooming on the laptop's touch screen when using the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i979637094139985931-411869923846407925",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.845231056",
            "featureRequest": {
                "fr_id": "v9i979637094139985931-411869923846407925",
                "message_id": "979637094139985931",
                "message": "the nesting whiteboard is soo cool, but the feature to point to it with an arrow is a must have for me to use the nested whiteboard",
                "created_at": "2022-05-27 06:48:04.020000+00:00",
                "author": "Phiapsi",
                "fr": "Add a feature to point to the nested whiteboard with an arrow.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i980572766984085564-8250518957310062831",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.868046939",
            "featureRequest": {
                "fr_id": "v9i980572766984085564-8250518957310062831",
                "message_id": "980572766984085564",
                "message": "it would be great to be able to link to whiteboards and not just cards",
                "created_at": "2022-05-29 20:46:05.810000+00:00",
                "author": "sundar",
                "fr": "Allow users to link to cards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9805727669840855643471943752904788632",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.868046939",
            "featureRequest": {
                "fr_id": "v9i9805727669840855643471943752904788632",
                "message_id": "980572766984085564",
                "message": "it would be great to be able to link to whiteboards and not just cards",
                "created_at": "2022-05-29 20:46:05.810000+00:00",
                "author": "sundar",
                "fr": "Allow users to link to whiteboards.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i982568996907929670-314856842757797453",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.821835279",
            "featureRequest": {
                "fr_id": "v9i982568996907929670-314856842757797453",
                "message_id": "982568996907929670",
                "message": "the card cannot connected to whiteboard. in some high level view, i expect a card may link to a referenced whiteboard. it would be great if this feature exist.",
                "created_at": "2022-06-04 08:58:24.112000+00:00",
                "author": "RickD",
                "fr": "Allow cards to link to referenced whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9825689969079296708853087529955483358",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.821835279",
            "featureRequest": {
                "fr_id": "v9i9825689969079296708853087529955483358",
                "message_id": "982568996907929670",
                "message": "the card cannot connected to whiteboard. in some high level view, i expect a card may link to a referenced whiteboard. it would be great if this feature exist.",
                "created_at": "2022-06-04 08:58:24.112000+00:00",
                "author": "RickD",
                "fr": "Allow cards to be connected to whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i984350148014514196-5874788021717034892",
            "pinned": false,
            "clusterId": 244,
            "oldCluster": -1,
            "score": "0.831524789",
            "featureRequest": {
                "fr_id": "v9i984350148014514196-5874788021717034892",
                "message_id": "984350148014514196",
                "message": "maybe this is what you need (at the top right corner of whiteboard). you can drag any card into current whiteboard.",
                "created_at": "2022-06-09 06:56:03.628000+00:00",
                "author": "hyxiao",
                "fr": "Add a feature to the top right corner of the whiteboard that allows users to drag cards into the current whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 244,
                "featureId": 49,
                "internalClusterId": 7,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 184,
                        "clusterId": 244,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 185,
                        "clusterId": 244,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 186,
                        "clusterId": 244,
                        "tagContent": "Navigation"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9847102775032668672409340754837081304",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.824073732",
            "featureRequest": {
                "fr_id": "v9i9847102775032668672409340754837081304",
                "message_id": "984710277503266867",
                "message": "hello, another idea: linking a card to a whiteboard using the same arrows we use to go, or link,  from card to card.",
                "created_at": "2022-06-10 06:47:05.189000+00:00",
                "author": "lower_orbit",
                "fr": "Link a card to a whiteboard using the same arrows used to link from card to card.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9847416987583938561941546851845392535",
            "pinned": false,
            "clusterId": 251,
            "oldCluster": -1,
            "score": "0.822553635",
            "featureRequest": {
                "fr_id": "v9i9847416987583938561941546851845392535",
                "message_id": "984741698758393856",
                "message": "hello.!\ni'm the person who canceled my subscription and came back... (heptabase's white board is so good)\n\n\n(i'm not good at english and i don't understand the conversation culture, so i'd like to use a translator. even if my text is rude, i want to let you know that my heart is very respectful... please forgive me!)\n\ni would like to suggest some new concepts+features.\na white board is not \"just\" a white board.\n1. this white board should be able to link to the text inside the card.\n2. overlapping white boards and cards on the white board must be connected with arrows.\n3. the white board should be able to preview inside the card, and it should be possible to preview in other white boards as well.",
                "created_at": "2022-06-10 08:51:56.600000+00:00",
                "author": "DBM",
                "fr": "Connect overlapping white boards and cards with arrows",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 251,
                "featureId": 49,
                "internalClusterId": 9,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 205,
                        "clusterId": 251,
                        "tagContent": "Interactivity"
                    },
                    {
                        "clusterTagId": 206,
                        "clusterId": 251,
                        "tagContent": "Navigation"
                    },
                    {
                        "clusterTagId": 207,
                        "clusterId": 251,
                        "tagContent": "Organization"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9847416987583938566034309837448629584",
            "pinned": false,
            "clusterId": 251,
            "oldCluster": -1,
            "score": "0.822553635",
            "featureRequest": {
                "fr_id": "v9i9847416987583938566034309837448629584",
                "message_id": "984741698758393856",
                "message": "hello.!\ni'm the person who canceled my subscription and came back... (heptabase's white board is so good)\n\n\n(i'm not good at english and i don't understand the conversation culture, so i'd like to use a translator. even if my text is rude, i want to let you know that my heart is very respectful... please forgive me!)\n\ni would like to suggest some new concepts+features.\na white board is not \"just\" a white board.\n1. this white board should be able to link to the text inside the card.\n2. overlapping white boards and cards on the white board must be connected with arrows.\n3. the white board should be able to preview inside the card, and it should be possible to preview in other white boards as well.",
                "created_at": "2022-06-10 08:51:56.600000+00:00",
                "author": "DBM",
                "fr": "Allow previewing inside cards and other white boards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 251,
                "featureId": 49,
                "internalClusterId": 9,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 205,
                        "clusterId": 251,
                        "tagContent": "Interactivity"
                    },
                    {
                        "clusterTagId": 206,
                        "clusterId": 251,
                        "tagContent": "Navigation"
                    },
                    {
                        "clusterTagId": 207,
                        "clusterId": 251,
                        "tagContent": "Organization"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9847416987583938568837655784173779169",
            "pinned": false,
            "clusterId": 251,
            "oldCluster": -1,
            "score": "0.82265991",
            "featureRequest": {
                "fr_id": "v9i9847416987583938568837655784173779169",
                "message_id": "984741698758393856",
                "message": "hello.!\ni'm the person who canceled my subscription and came back... (heptabase's white board is so good)\n\n\n(i'm not good at english and i don't understand the conversation culture, so i'd like to use a translator. even if my text is rude, i want to let you know that my heart is very respectful... please forgive me!)\n\ni would like to suggest some new concepts+features.\na white board is not \"just\" a white board.\n1. this white board should be able to link to the text inside the card.\n2. overlapping white boards and cards on the white board must be connected with arrows.\n3. the white board should be able to preview inside the card, and it should be possible to preview in other white boards as well.",
                "created_at": "2022-06-10 08:51:56.600000+00:00",
                "author": "DBM",
                "fr": "Link text inside cards to the white board",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 251,
                "featureId": 49,
                "internalClusterId": 9,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 205,
                        "clusterId": 251,
                        "tagContent": "Interactivity"
                    },
                    {
                        "clusterTagId": 206,
                        "clusterId": 251,
                        "tagContent": "Navigation"
                    },
                    {
                        "clusterTagId": 207,
                        "clusterId": 251,
                        "tagContent": "Organization"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i985480677002715136-102196399069593038",
            "pinned": false,
            "clusterId": 247,
            "oldCluster": -1,
            "score": "0.824675083",
            "featureRequest": {
                "fr_id": "v9i985480677002715136-102196399069593038",
                "message_id": "985480677002715136",
                "message": "i think someone already mentioned it here: it would be great if we could filter on the whiteboard - in the similar way, we can do it now in the card library.",
                "created_at": "2022-06-12 09:48:22.743000+00:00",
                "author": "NevTheWiz",
                "fr": "Add a filter feature to the whiteboard similar to the filter feature in the card library.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 247,
                "featureId": 49,
                "internalClusterId": 1,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 193,
                        "clusterId": 247,
                        "tagContent": "Ease of use"
                    },
                    {
                        "clusterTagId": 194,
                        "clusterId": 247,
                        "tagContent": "Customization"
                    },
                    {
                        "clusterTagId": 195,
                        "clusterId": 247,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i988206702438543430-1597688366321174714",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.82255137",
            "featureRequest": {
                "fr_id": "v9i988206702438543430-1597688366321174714",
                "message_id": "988206702438543430",
                "message": "please let us search for whiteboards/tags in this menu\ni feel like after a few months of using hepta i will have so many whiteboards/ tags that using the scrolable lists will become horrable to use",
                "created_at": "2022-06-19 22:20:37.854000+00:00",
                "author": "xidafo",
                "fr": "Allow users to search for whiteboards/tags in the menu.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i988206702438543430490362457233067386",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.82255137",
            "featureRequest": {
                "fr_id": "v9i988206702438543430490362457233067386",
                "message_id": "988206702438543430",
                "message": "please let us search for whiteboards/tags in this menu\ni feel like after a few months of using hepta i will have so many whiteboards/ tags that using the scrolable lists will become horrable to use",
                "created_at": "2022-06-19 22:20:37.854000+00:00",
                "author": "xidafo",
                "fr": "Make scrollable lists easier to use after a few months of using Hepta.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i988791457504714782400180127790703421",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.820081353",
            "featureRequest": {
                "fr_id": "v9i988791457504714782400180127790703421",
                "message_id": "988791457504714782",
                "message": "sure. for different projects setup as whiteboards, i have cards with same titles. ability to link whiteboards would make it less confusing to link cards with same title.",
                "created_at": "2022-06-21 13:04:14.326000+00:00",
                "author": "sundar",
                "fr": "Provide the ability to link whiteboards together to make it easier to link cards with the same title.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i989545726075879424-234943659018786336",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.850779355",
            "featureRequest": {
                "fr_id": "v9i989545726075879424-234943659018786336",
                "message_id": "989545726075879424",
                "message": "ability to create a whiteboard backed up with search queries (tags, containing images, unchecked checkboxes etc..) so it will pull up cards across the workspace and present it. i could see this work as a moodboard, task management board etc..",
                "created_at": "2022-06-23 15:01:25.967000+00:00",
                "author": "sundar",
                "fr": "Allow the whiteboard to be used as a moodboard or task management board",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9895457260758794241552910839901900315",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.850779355",
            "featureRequest": {
                "fr_id": "v9i9895457260758794241552910839901900315",
                "message_id": "989545726075879424",
                "message": "ability to create a whiteboard backed up with search queries (tags, containing images, unchecked checkboxes etc..) so it will pull up cards across the workspace and present it. i could see this work as a moodboard, task management board etc..",
                "created_at": "2022-06-23 15:01:25.967000+00:00",
                "author": "sundar",
                "fr": "Allow the whiteboard to pull up cards across the workspace",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9895457260758794245479307649931513506",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.850779355",
            "featureRequest": {
                "fr_id": "v9i9895457260758794245479307649931513506",
                "message_id": "989545726075879424",
                "message": "ability to create a whiteboard backed up with search queries (tags, containing images, unchecked checkboxes etc..) so it will pull up cards across the workspace and present it. i could see this work as a moodboard, task management board etc..",
                "created_at": "2022-06-23 15:01:25.967000+00:00",
                "author": "sundar",
                "fr": "Add the ability to create a whiteboard backed up with search queries",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9895457260758794248071668836029176723",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.850779355",
            "featureRequest": {
                "fr_id": "v9i9895457260758794248071668836029176723",
                "message_id": "989545726075879424",
                "message": "ability to create a whiteboard backed up with search queries (tags, containing images, unchecked checkboxes etc..) so it will pull up cards across the workspace and present it. i could see this work as a moodboard, task management board etc..",
                "created_at": "2022-06-23 15:01:25.967000+00:00",
                "author": "sundar",
                "fr": "Enable the whiteboard to contain images, unchecked checkboxes, and other elements",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i993170308255191143-2957249195487329221",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.820492268",
            "featureRequest": {
                "fr_id": "v9i993170308255191143-2957249195487329221",
                "message_id": "993170308255191143",
                "message": "while on a whiteboard or card library, display tags or show some evidence that those cards have tags",
                "created_at": "2022-07-03 15:04:13.700000+00:00",
                "author": "Rodrigo Faerman",
                "fr": "Display tags on a whiteboard or card library",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9931703082551911432360580245683215971",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.820492268",
            "featureRequest": {
                "fr_id": "v9i9931703082551911432360580245683215971",
                "message_id": "993170308255191143",
                "message": "while on a whiteboard or card library, display tags or show some evidence that those cards have tags",
                "created_at": "2022-07-03 15:04:13.700000+00:00",
                "author": "Rodrigo Faerman",
                "fr": "Show evidence that cards have tags on a whiteboard or card library",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i995831372532949063-483018385500500328",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.822576404",
            "featureRequest": {
                "fr_id": "v9i995831372532949063-483018385500500328",
                "message_id": "995831372532949063",
                "message": "what if we could see the full content of a child whiteboard from a parent whiteboard? thinking of matching some really interesting nesting functionality available in infinity map (mentioned here: https://discord.com/channels/812292969183969301/856016372990738472/995473982071504927)",
                "created_at": "2022-07-10 23:18:20.864000+00:00",
                "author": "Max",
                "fr": "Provide nesting functionality similar to that available in Infinity Map.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9958313725329490634067807760922629225",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.822576404",
            "featureRequest": {
                "fr_id": "v9i9958313725329490634067807760922629225",
                "message_id": "995831372532949063",
                "message": "what if we could see the full content of a child whiteboard from a parent whiteboard? thinking of matching some really interesting nesting functionality available in infinity map (mentioned here: https://discord.com/channels/812292969183969301/856016372990738472/995473982071504927)",
                "created_at": "2022-07-10 23:18:20.864000+00:00",
                "author": "Max",
                "fr": "Allow users to view the full content of a child whiteboard from a parent whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9974744921819259286628322807609077416",
            "pinned": false,
            "clusterId": 243,
            "oldCluster": -1,
            "score": "0.833158612",
            "featureRequest": {
                "fr_id": "v9i9974744921819259286628322807609077416",
                "message_id": "997474492181925928",
                "message": "dude, how about put images and videos ect... in the whiteboard ?",
                "created_at": "2022-07-15 12:07:31.116000+00:00",
                "author": "char_lie",
                "fr": "Add the ability to put images and videos in the whiteboard.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 243,
                "featureId": 49,
                "internalClusterId": 8,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 181,
                        "clusterId": 243,
                        "tagContent": "Organization"
                    },
                    {
                        "clusterTagId": 182,
                        "clusterId": 243,
                        "tagContent": "Searchability"
                    },
                    {
                        "clusterTagId": 183,
                        "clusterId": 243,
                        "tagContent": "Collaboration"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9981554354649825485516519985788587414",
            "pinned": false,
            "clusterId": 249,
            "oldCluster": -1,
            "score": "0.820083",
            "featureRequest": {
                "fr_id": "v9i9981554354649825485516519985788587414",
                "message_id": "998155435464982548",
                "message": "-\nanother performance input:\nwhen there are more than 50 cards inside one whiteboard, the drag-and-move action feels obvious delayed.\nthe response time between \"right-click\" and \"move\" feels like 0.3~0.5 sec or more.\nthe movement is smooth is most of whiteboards, but it's delayed in certain whiteboard with lots of card.\nwish to optimise this in the future.",
                "created_at": "2022-07-17 09:13:20.646000+00:00",
                "author": "ç¦åº",
                "fr": "Optimize the response time between right-clicking and moving cards in whiteboards with more than 50 cards to be less than 0.5 seconds.",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 249,
                "featureId": 49,
                "internalClusterId": 6,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 199,
                        "clusterId": 249,
                        "tagContent": "Usability"
                    },
                    {
                        "clusterTagId": 200,
                        "clusterId": 249,
                        "tagContent": "Flexibility"
                    },
                    {
                        "clusterTagId": 201,
                        "clusterId": 249,
                        "tagContent": "Speed"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i999785537848229918-2366317933781636186",
            "pinned": false,
            "clusterId": 252,
            "oldCluster": -1,
            "score": "0.817119479",
            "featureRequest": {
                "fr_id": "v9i999785537848229918-2366317933781636186",
                "message_id": "999785537848229918",
                "message": "i desperate want an iphone app so i can at access, if not add, notes and whiteboards on my phone",
                "created_at": "2022-07-21 21:10:47.340000+00:00",
                "author": "Andrew Purdum",
                "fr": "Create an iPhone app that allows users to access notes and whiteboards",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 252,
                "featureId": 49,
                "internalClusterId": 0,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 208,
                        "clusterId": 252,
                        "tagContent": "Mobile Access"
                    },
                    {
                        "clusterTagId": 209,
                        "clusterId": 252,
                        "tagContent": "Notes & Whiteboards"
                    },
                    {
                        "clusterTagId": 210,
                        "clusterId": 252,
                        "tagContent": "iPhone App"
                    }
                ]
            }
        },
        {
            "featureId": 49,
            "featureRequestId": "v9i9997855378482299184938463269341536402",
            "pinned": false,
            "clusterId": 252,
            "oldCluster": -1,
            "score": "0.817231774",
            "featureRequest": {
                "fr_id": "v9i9997855378482299184938463269341536402",
                "message_id": "999785537848229918",
                "message": "i desperate want an iphone app so i can at access, if not add, notes and whiteboards on my phone",
                "created_at": "2022-07-21 21:10:47.340000+00:00",
                "author": "Andrew Purdum",
                "fr": "Allow users to add notes and whiteboards on the iPhone app",
                "userId": "110421822788553907926",
                "datasetId": 67
            },
            "cluster": {
                "clusterId": 252,
                "featureId": 49,
                "internalClusterId": 0,
                "description": "",
                "type": "localKMeans",
                "clusterTags": [
                    {
                        "clusterTagId": 208,
                        "clusterId": 252,
                        "tagContent": "Mobile Access"
                    },
                    {
                        "clusterTagId": 209,
                        "clusterId": 252,
                        "tagContent": "Notes & Whiteboards"
                    },
                    {
                        "clusterTagId": 210,
                        "clusterId": 252,
                        "tagContent": "iPhone App"
                    }
                ]
            }
        }
    ],
    "clusters": null
}

export default function PlaceholderFeature(props){
    const titleRef = useRef();
    const [titleFocused, setTitleFocused] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);
    const [headerCollapsed, setHeaderCollapsed] = useState(false);

    const [description, setDescription] = useState("No description")
    const [title, setTitle] = useState("")
    const params = useParams();
    const matches = useMatches();

    const actionData = useActionData();
    const fetcher = useFetcher();
    const descriptionFetcher = useFetcher();
    const noResultsFetcher = useFetcher();
    const navigate = useTransition();

    const [zoomObject, setZoomObject] = useState(null)
    const [triggerClusters, setTriggerClusters] = useState(false)
    const [dataView, setDataView] = useState("featureRequests")
    const [expandSpecificCard, setExpandSpecificCard] = useState({cardId: null, cardType: null})
    const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState([])
    const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState([])
    const [topLevelFilteredData, setTopLevelFilteredData] = useState([])
    const [invisibleFilters, setInvisibleFilters] = useState([])
    const [searchText, setSearchText] = useState("")
    const [searchResults, setSearchResults] = useState([])


    const [clustersGenerated, setClustersGenerated] = useState("incomplete")
    
    // LANDING PAGE LOGIC
    useEffect(()=>{
        setDataView(props.landingPageDataView)
    }, [props.landingPageDataView])

    useEffect(()=>{
        setSearchText(props.landingPageSearchText)
    }, [props.landingPageSearchText])


    // determine if clusters have been processed and update the state
    useEffect(()=>{
            ((loaderData.featureRequests && loaderData.featureRequests[0]?.cluster !== null) 
            ? setClustersGenerated("completed")
            : setClustersGenerated("incomplete"))

            loaderData.clusters === '202' && setClustersGenerated('initiated')
            loaderData.clusters === '404' && setClustersGenerated('error')

            // TODO should we automatically trigger this if clusters are incomplete?
        }, [loaderData.featureRequests])

    // TITLE EFFECTS
    useEffect(()=>{
        setTitle(loaderData.feature.title)
        setDescription(loaderData.feature.description)
    }, [loaderData])

    useEffect(()=>{
        setTopLevelStreamDataObj(loaderData.featureRequests)
        setTopLevelCanvasDataObj(loaderData.featureRequests)
    }, [loaderData.featureRequests])


    function handleTitleSearch(){
    }

    useEffect(()=>{
        if(searchText){
            setSearchResults(topLevelFilteredData.filter(x => x.featureRequest.fr.toLowerCase().includes(searchText.toLowerCase())).map(fr => fr.featureRequest.fr_id))
            setTopLevelStreamDataObj(topLevelFilteredData.filter(x => x.featureRequest.fr.toLowerCase().includes(searchText.toLowerCase())))
            
        }
        else{
            setSearchResults([])
            setTopLevelStreamDataObj(topLevelFilteredData)
        }
    }, [searchText])

    useEffect(()=>{
        d3.selectAll(".frNode")
          .classed("invisibleFrNode", false)

        if(searchText){
            d3.selectAll(".frNode").classed("invisibleFrNode", true)

            for(let fr_id of searchResults){
                d3.select(`#fr-${fr_id}`)
                  .classed("invisibleFrNode", false)
            }
        }
    }, [searchResults])
   

    useEffect(()=>{
        const filteredData = loaderData.featureRequests.filter(function(fr){
            const filterConditions = []
            for(let filter of loaderData.feature.filters){
                if(filter.type === "date" && !invisibleFilters.includes(filter.filterId)){
                    if(filter.dateVariant === 'before'){
                        filterConditions.push(dayjs.utc(fr.featureRequest.created_at).isBefore(dayjs(filter.date)))
                    }
                    else if(filter.dateVariant === 'during'){
                        filterConditions.push(dayjs.utc(fr.featureRequest.created_at).isSame(dayjs(filter.date), 'year'))
                    }
                    else if(filter.dateVariant === 'after'){
                        filterConditions.push(dayjs.utc(fr.featureRequest.created_at).isAfter(dayjs(filter.date)))
                    }
                    else{
                        console.error("Unexpected Date Variant")
                    }
                }
                else if(filter.type === 'author'){
                    filterConditions.push(fr.featureRequest.author === filter.author)
                }
                else{
                    console.error("Unexpected Filter Type")
                }
            }
            return filterConditions.every(Boolean) 
        })

        setTopLevelStreamDataObj(filteredData)
        setTopLevelCanvasDataObj(filteredData)
        setTopLevelFilteredData(filteredData)

    }, [loaderData.feature, invisibleFilters])

    return(
        <div className='featurePageWrapper' 
            style={{
                width: "125%", 
                height: "125%",
                transform: "scale(0.8)",
                transformOrigin: "top left",
                
                }}>
            <PlaceholderHeader 
                headerCollapsed={headerCollapsed}
                />
            <div className="featureTitleScaffold">
                <div className="featureTitleWrapper">
                        <div 
                            className='featureTitleInnerWrapper' 
                            onClick={()=>setTitleFocused(true)} 
                            > 
                            <h1 className='featureTitleText' 
                                style={{fontSize: headerCollapsed ? "24px" : "40px"}}>{title} {title && <span>/</span>} <span style={{color: "#B0BFB9", textTransform: "capitalize"}}>Discovery</span></h1>
                        </div>
                    <div 
                        className='featureDropDownArrow' 
                        onClick={()=>setHeaderCollapsed(prevState => !prevState)}
                        style={{
                            transform: headerCollapsed ? "rotate(0deg)" : "rotate(180deg)",
                            height: headerCollapsed ? "22px" : "30px",
                            width: headerCollapsed ? "22px" : "30px",
                            top: headerCollapsed ? "2px" : "7.5px",
                            left: headerCollapsed ? "-24px" : "-36px",
                               }}>
                            <IoIosArrowDropdown color="#B0BFB9"/>
                    </div>
                    <div style={{flex: 1}}/>
                    <input type='hidden' name='searchTerm' value={title} />
                    <input type='hidden' name='featureId' value={params["*"]}/>
                    <input type='hidden' name='actionType' value='featureSearch' />
                    <Tooltip title="Finds feature requests relevant to your feature title" arrow placement='top'>
                        <button 
                            className='searchIconWrapper'
                            onClick={handleTitleSearch}
                            >
                            <ImSearch 
                                className='searchIconText'
                                style={{
                                    width: headerCollapsed ? "20px" : "40px",
                                    height: headerCollapsed ? "20px" : "40px",
                                }}/>
                        </button>
                    </Tooltip>
                </div>
                {navigate.type === "fetchActionRedirect" &&
                    <LinearProgress 
                        variant="indeterminate"
                        style={{width: "100%", 
                                height: "2px", 
                                backgroundColor: 'rgba(119, 153, 141, 0.3)'}}
                    />
                }
    
                <div className="pinnedMessagesWrapper" style={{fontSize: headerCollapsed ? "0px" : "18px"}}>
                    <p className='pinnedMessagesText'><em>{loaderData.feature._count.featureRequests} pinned {(loaderData.feature._count.featureRequests == 1) ? <span>message</span> : <span>messages</span>}</em></p>
                </div>
                <textarea 
                    style={{
                        fontSize: headerCollapsed ? "0px" : "16px",
                        height: headerCollapsed ? "0px" : "50px",
                    }}
                    className='featureDescriptionWrapper' 
                    readOnly
                    value={(description == "" && !descriptionFocused) ? "No Description" : description}
                    // onFocus={()=>setDescriptionFocused(true)}
                    // onChange={(e)=>setDescription(e.target.value)}
                    />
                
                {/* <descriptionFetcher.Form method='post' style={{height: "0px"}}>
                    <input type='hidden' name='actionType' value='saveDescription' />
                    <input type='hidden' name='featureId' value={params["*"]} />
                    <input type="hidden" name="featureDescription" value={description} />
                    <button className='featureDescriptionSave' type="submit" style={{fontSize: descriptionFocused ? "16px" : "0px"}}>
                        <p onClick={()=>setDescriptionFocused(false)}>Save</p>
                    </button>
                </descriptionFetcher.Form> */}
            </div>
            <div className='workspaceScaffold'>
                <div className='workspaceOutletScaffold'>
                    <div className='workspaceOutletControls'>
                            <Tooltip title="Discovery: identifying patterns and applying filters" placement='top' arrow>
                                <div className={cn('notepadTab discovery',
                                                    {"notepadTabActive": matches[2] ? matches[2].pathname.includes('discovery') : false}
                                                    )}>
                                    <p className="notepadTabLabel">
                                        <GoTelescope />
                                    </p>
                                </div>
                            </Tooltip>
                            <Tooltip title="Notepad: making notes and synthesising ideas" placement='top' arrow>
                                <div className={cn('notepadTab writing',
                                                    {"notepadTabActive": matches[2] ? matches[2].pathname.includes('notepad') : false}
                                                    )}>
                                    <p className="notepadTabLabel">
                                        <BiNotepad />
                                    </p>
                                </div>
                            </Tooltip>
                    </div>
                    <div className='workspaceOutletInnerScaffold'>
                        {props.landingPageFeatureOutletToggle
                            ? <PlaceholderNotepad />
                            : <PlaceholderDiscovery
                            topLevelCanvasDataObj={topLevelCanvasDataObj}
                            topLevelStreamDataObj={topLevelStreamDataObj}
                            setTopLevelCanvasDataObj={setTopLevelCanvasDataObj}
                            setTopLevelStreamDataObj={setTopLevelStreamDataObj}
                            loaderData={loaderData}
                            headerCollapsed={headerCollapsed}
                            zoomObject={zoomObject}
                            setZoomObject={setZoomObject}
                            clustersGenerated={clustersGenerated}
                            triggerClusters={triggerClusters}
                            setTriggerClusters={setTriggerClusters}
                            setDataView={setDataView}
                            setExpandSpecificCard={setExpandSpecificCard}
                            topLevelFilteredData={topLevelFilteredData}
                        />
                        }
                    </div>
                </div>
                <div className='messageStreamScaffold'>
                    <div className="messageStreamColumn">
                        <MessageStream
                            data={topLevelStreamDataObj}
                            featureId={loaderData.feature.id}
                            featureTitle={loaderData.feature.title}
                            filters={loaderData.feature.filters}
                            clustersGenerated={clustersGenerated}
                            setClustersGenerated={setClustersGenerated}
                            setTriggerClusters={setTriggerClusters}
                            setZoomObject={setZoomObject}
                            dataView={dataView}
                            setDataView={setDataView}
                            expandSpecificCard={expandSpecificCard}
                            invisibleFilters={invisibleFilters}
                            setInvisibleFilters={setInvisibleFilters}
                            searchText={searchText}
                            setSearchText={setSearchText}
                            landingPageSearchBarRef={props.landingPageSearchBarRef}
                            />
                    </div>
                </div>
            </div>
            <div style={{gridRow: "2 / 5", gridColumn: "3"}}></div>
            </div>

    )
}