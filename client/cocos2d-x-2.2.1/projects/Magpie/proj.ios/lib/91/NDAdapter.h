//
//  NDAdapter.h
//  Magpie
//
//  Created by lCeve on 14-4-11.
//
//

#ifndef __ND_ADAPTER__
#define __ND_ADAPTER__

#include <iostream>

class NDAdapter
{
public:
    NDAdapter();
    virtual ~NDAdapter();
    
    static NDAdapter * NDAdapterInstance();
    
    void NDInit(int appId, const char * appKey, int versionCheckLevel);
};

#endif /* defined(__ND_ADAPTER__) */
